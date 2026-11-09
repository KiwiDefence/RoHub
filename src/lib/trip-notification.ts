import type { BookingWithTravel } from "@/lib/travel";
import { travelDayIndex } from "@/lib/travel";
import { isNativeApp } from "@/lib/native";

const CHANNEL_ID = "rohub-travel";
const NOTIF_ID = 41001;

/** Latest active booking — notification only posts when the app is backgrounded. */
let activeBooking: BookingWithTravel | null = null;
let appInForeground = true;

export function setTripNotificationBooking(
  booking: BookingWithTravel | null,
): void {
  activeBooking = booking;
  if (!booking || appInForeground) {
    void clearTripNotification();
    return;
  }
  void showTripNotification();
}

/** Keep the cached booking in sync; never pops a notification while the app is open. */
export async function syncTripNotification(
  booking: BookingWithTravel | null,
): Promise<void> {
  setTripNotificationBooking(booking);
}

async function ensurePermission(): Promise<boolean> {
  const { LocalNotifications } = await import("@capacitor/local-notifications");
  const { display } = await LocalNotifications.checkPermissions();
  if (display === "granted") return true;
  const req = await LocalNotifications.requestPermissions();
  return req.display === "granted";
}

async function showTripNotification(): Promise<void> {
  if (typeof window === "undefined" || !isNativeApp()) return;
  if (!activeBooking?.travel || appInForeground) return;

  try {
    const { LocalNotifications } = await import("@capacitor/local-notifications");
    if (!(await ensurePermission())) return;

    await LocalNotifications.createChannel({
      id: CHANNEL_ID,
      name: "Călătoria mea",
      description: "Itinerariu și Piticot pe durata vacanței",
      importance: 3,
      visibility: 1,
      vibration: false,
      sound: undefined,
    });

    const day = travelDayIndex(activeBooking) + 1;
    const dayTitle =
      activeBooking.travel.itinerary[day - 1]?.title ?? `Ziua ${day}`;

    await LocalNotifications.schedule({
      notifications: [
        {
          id: NOTIF_ID,
          title: activeBooking.travel.title,
          body: `${dayTitle} · deschide itinerariul / Piticot`,
          channelId: CHANNEL_ID,
          ongoing: true,
          autoCancel: false,
          extra: { route: "/calatorie/" },
          smallIcon: "ic_launcher",
          silent: true,
        },
      ],
    });
  } catch {
    /* plugin missing or web */
  }
}

export async function clearTripNotification(): Promise<void> {
  if (typeof window === "undefined" || !isNativeApp()) return;
  try {
    const { LocalNotifications } = await import("@capacitor/local-notifications");
    await LocalNotifications.cancel({ notifications: [{ id: NOTIF_ID }] });
  } catch {
    /* ignore */
  }
}

/**
 * Show the ongoing trip notification only when the app is backgrounded;
 * clear it as soon as the user returns.
 */
export async function bindTripNotificationLifecycle(): Promise<() => void> {
  if (!isNativeApp()) return () => {};

  try {
    const { App } = await import("@capacitor/app");
    const handle = await App.addListener("appStateChange", ({ isActive }) => {
      appInForeground = isActive;
      if (isActive) {
        void clearTripNotification();
      } else if (activeBooking?.travel) {
        void showTripNotification();
      }
    });
    // Start clear while in-app (e.g. after a remount).
    appInForeground = true;
    void clearTripNotification();
    return () => {
      void handle.remove();
    };
  } catch {
    return () => {};
  }
}

/** Open /calatorie when the ongoing notification is tapped. */
export async function bindTripNotificationOpen(
  openRoute: (path: string) => void,
): Promise<() => void> {
  if (!isNativeApp()) return () => {};
  try {
    const { LocalNotifications } = await import("@capacitor/local-notifications");
    const handle = await LocalNotifications.addListener(
      "localNotificationActionPerformed",
      (event) => {
        const route =
          (event.notification.extra as { route?: string } | undefined)?.route ??
          "/calatorie/";
        openRoute(route);
      },
    );
    return () => {
      void handle.remove();
    };
  } catch {
    return () => {};
  }
}
