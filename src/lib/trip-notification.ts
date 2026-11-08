import type { BookingWithTravel } from "@/lib/travel";
import { travelDayIndex } from "@/lib/travel";
import { isNativeApp } from "@/lib/native";

const CHANNEL_ID = "rohub-travel";
const NOTIF_ID = 41001;

/** Ongoing Android notification while a demo travel is active (Maps / Kiwi style). */
export async function syncTripNotification(
  booking: BookingWithTravel | null,
): Promise<void> {
  if (typeof window === "undefined" || !isNativeApp()) return;

  try {
    const { LocalNotifications } = await import("@capacitor/local-notifications");

    const { display } = await LocalNotifications.checkPermissions();
    if (display !== "granted") {
      const req = await LocalNotifications.requestPermissions();
      if (req.display !== "granted") {
        if (!booking) await clearTripNotification();
        return;
      }
    }

    await LocalNotifications.createChannel({
      id: CHANNEL_ID,
      name: "Călătoria mea",
      description: "Itinerariu și Piticot pe durata vacanței",
      importance: 4,
      visibility: 1,
      vibration: false,
    });

    if (!booking?.travel) {
      await clearTripNotification();
      return;
    }

    const day = travelDayIndex(booking) + 1;
    const dayTitle =
      booking.travel.itinerary[day - 1]?.title ?? `Ziua ${day}`;

    await LocalNotifications.schedule({
      notifications: [
        {
          id: NOTIF_ID,
          title: booking.travel.title,
          body: `${dayTitle} · deschide itinerariul / Piticot`,
          channelId: CHANNEL_ID,
          ongoing: true,
          autoCancel: false,
          extra: { route: "/calatorie/" },
          smallIcon: "ic_launcher",
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
