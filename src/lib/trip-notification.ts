import type { LocalNotificationSchema } from "@capacitor/local-notifications";
import { normalizeTravel } from "@/lib/demo-travels";
import { isNativeApp } from "@/lib/native";
import type { BookingWithTravel } from "@/lib/travel";
import { travelDayIndex } from "@/lib/travel";

const CHANNEL_LIVE = "rohub-trip-live";
const CHANNEL_REMINDERS = "rohub-trip-reminders";
const CHANNEL_PITICOT = "rohub-piticot";

const ACTION_TRIP = "ROHUB_TRIP_ACTIONS";
const ACTION_PITICOT = "ROHUB_PITICOT_ACTIONS";

const ONGOING_ID = 41001;
const DAY_START_BASE = 41100;
const SLOT_BASE = 41200;
const SCAN_BASE = 41300;
const TRIP_END_ID = 41400;
const UNLOCK_ID = 41410;
const DEMO_BASE = 41500;

const SCHEDULED_ID_MAX = 41600;

/** Latest active booking — ongoing status only when the app is backgrounded. */
let activeBooking: BookingWithTravel | null = null;
let appInForeground = true;
let actionsReady = false;

function addDaysIso(iso: string, days: number): string {
  const d = new Date(`${iso}T12:00:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function atLocal(dateIso: string, timeHhMm: string): Date {
  const [h, m] = timeHhMm.split(":").map((n) => Number(n));
  const d = new Date(`${dateIso}T00:00:00`);
  d.setHours(h || 0, m || 0, 0, 0);
  return d;
}

function isPiticotSlot(title: string, detail?: string): boolean {
  const t = `${title} ${detail ?? ""}`.toLowerCase();
  return t.includes("piticot") || t.includes("qr") || t.includes("scan");
}

async function ensurePermission(): Promise<boolean> {
  const { LocalNotifications } = await import("@capacitor/local-notifications");
  const { display } = await LocalNotifications.checkPermissions();
  if (display === "granted") return true;
  const req = await LocalNotifications.requestPermissions();
  return req.display === "granted";
}

export async function requestTripNotificationPermission(): Promise<boolean> {
  if (typeof window === "undefined" || !isNativeApp()) return false;
  try {
    return await ensurePermission();
  } catch {
    return false;
  }
}

async function ensureChannels(): Promise<void> {
  const { LocalNotifications } = await import("@capacitor/local-notifications");
  await LocalNotifications.createChannel({
    id: CHANNEL_LIVE,
    name: "Călătorie activă",
    description: "Status pe durata vacanței",
    importance: 2,
    visibility: 1,
    vibration: false,
    sound: undefined,
  });
  await LocalNotifications.createChannel({
    id: CHANNEL_REMINDERS,
    name: "Programul zilei",
    description: "Memento-uri pentru opriri și activități",
    importance: 5,
    visibility: 1,
    vibration: true,
  });
  await LocalNotifications.createChannel({
    id: CHANNEL_PITICOT,
    name: "Piticot",
    description: "Scanări și deblocări pe traseu",
    importance: 4,
    visibility: 1,
    vibration: true,
  });
}

async function ensureActionTypes(): Promise<void> {
  if (actionsReady) return;
  const { LocalNotifications } = await import("@capacitor/local-notifications");
  await LocalNotifications.registerActionTypes({
    types: [
      {
        id: ACTION_TRIP,
        actions: [
          { id: "open_hub", title: "Program", foreground: true },
          { id: "open_piticot", title: "Piticot", foreground: true },
        ],
      },
      {
        id: ACTION_PITICOT,
        actions: [
          { id: "open_piticot", title: "Deschide Piticot", foreground: true },
          { id: "open_hub", title: "Călătoria", foreground: true },
        ],
      },
    ],
  });
  actionsReady = true;
}

async function cancelAllTripNotifications(): Promise<void> {
  const { LocalNotifications } = await import("@capacitor/local-notifications");
  const ids = [{ id: ONGOING_ID }, { id: TRIP_END_ID }, { id: UNLOCK_ID }];
  for (let i = DAY_START_BASE; i < SCHEDULED_ID_MAX; i++) {
    ids.push({ id: i });
  }
  await LocalNotifications.cancel({ notifications: ids });
}

function buildScheduledNotifications(
  booking: BookingWithTravel,
): LocalNotificationSchema[] {
  const travel = booking.travel ? normalizeTravel(booking.travel) : null;
  if (!travel) return [];

  const now = Date.now();
  const list: LocalNotificationSchema[] = [];
  let slotIdx = 0;
  let scanIdx = 0;

  travel.itinerary.forEach((day, dayIndex) => {
    const dateIso = addDaysIso(booking.startsOn, dayIndex);
    const dayAt = atLocal(dateIso, "08:00");
    if (dayAt.getTime() > now) {
      list.push({
        id: DAY_START_BASE + dayIndex,
        title: `Ziua ${dayIndex + 1} începe`,
        body: day.title,
        largeBody: `Programul pentru ${day.title}. Deschide Călătoria mea.`,
        summaryText: travel.title,
        channelId: CHANNEL_REMINDERS,
        actionTypeId: ACTION_TRIP,
        schedule: { at: dayAt, allowWhileIdle: true },
        extra: { route: "/calatorie/" },
        group: "rohub-trip",
        autoCancel: true,
      });
    }

    for (const slot of day.slots) {
      const slotAt = atLocal(dateIso, slot.time);
      if (slotAt.getTime() > now) {
        list.push({
          id: SLOT_BASE + slotIdx,
          title: slot.title,
          body: `${slot.time}${slot.place ? ` · ${slot.place}` : ""}`,
          largeBody: slot.detail ?? slot.title,
          summaryText: day.title,
          channelId: CHANNEL_REMINDERS,
          actionTypeId: ACTION_TRIP,
          schedule: { at: slotAt, allowWhileIdle: true },
          extra: { route: "/calatorie/" },
          group: "rohub-trip",
          autoCancel: true,
        });
      }
      slotIdx += 1;

      if (travel.includesPiticot && isPiticotSlot(slot.title, slot.detail)) {
        const scanAt = new Date(slotAt.getTime() - 15 * 60_000);
        if (scanAt.getTime() > now) {
          list.push({
            id: SCAN_BASE + scanIdx,
            title: "Pregătește scanarea QR",
            body: `Urmează: ${slot.title}`,
            largeBody:
              "Deschide Piticot și scanează codul de la oprire când ajungi.",
            channelId: CHANNEL_PITICOT,
            actionTypeId: ACTION_PITICOT,
            schedule: { at: scanAt, allowWhileIdle: true },
            extra: { route: "/inovatie/piticot/" },
            group: "rohub-piticot",
            autoCancel: true,
          });
        }
        scanIdx += 1;
      }
    }
  });

  const endAt = atLocal(booking.endsOn, "18:00");
  if (endAt.getTime() > now) {
    list.push({
      id: TRIP_END_ID,
      title: "Călătorie încheiată",
      body: `Mulțumim că ai fost cu noi pe ${travel.title}.`,
      largeBody: "Poți redeschide povestea Piticot sau contacta echipa pentru probleme.",
      channelId: CHANNEL_REMINDERS,
      actionTypeId: ACTION_TRIP,
      schedule: { at: endAt, allowWhileIdle: true },
      extra: { route: "/calatorie/" },
      autoCancel: true,
    });
  }

  return list;
}

async function scheduleItinerary(booking: BookingWithTravel): Promise<void> {
  const { LocalNotifications } = await import("@capacitor/local-notifications");
  const notifications = buildScheduledNotifications(booking);
  if (notifications.length === 0) return;
  // Android batch size — schedule in chunks
  const chunk = 40;
  for (let i = 0; i < notifications.length; i += chunk) {
    await LocalNotifications.schedule({
      notifications: notifications.slice(i, i + chunk),
    });
  }
}

async function showOngoingIfNeeded(): Promise<void> {
  if (!activeBooking?.travel || appInForeground) return;
  const { LocalNotifications } = await import("@capacitor/local-notifications");
  const day = travelDayIndex(activeBooking) + 1;
  const dayTitle =
    activeBooking.travel.itinerary[day - 1]?.title ?? `Ziua ${day}`;

  await LocalNotifications.schedule({
    notifications: [
      {
        id: ONGOING_ID,
        title: activeBooking.travel.title,
        body: `${dayTitle} · deschide programul`,
        largeBody: "Atinge pentru itinerariu, hartă și Piticot.",
        channelId: CHANNEL_LIVE,
        actionTypeId: ACTION_TRIP,
        ongoing: true,
        autoCancel: false,
        extra: { route: "/calatorie/" },
        group: "rohub-trip",
      },
    ],
  });
}

/**
 * Cache booking, cancel old schedules, reschedule itinerary reminders.
 * Ongoing status still only shows while backgrounded.
 */
export function setTripNotificationBooking(
  booking: BookingWithTravel | null,
): void {
  activeBooking = booking;
  void (async () => {
    if (!isNativeApp()) return;
    try {
      if (!booking?.travel) {
        await cancelAllTripNotifications();
        return;
      }
      if (!(await ensurePermission())) return;
      await ensureChannels();
      await ensureActionTypes();
      await cancelAllTripNotifications();
      await scheduleItinerary(booking);
      if (!appInForeground) await showOngoingIfNeeded();
    } catch {
      /* plugin / web */
    }
  })();
}

export async function syncTripNotification(
  booking: BookingWithTravel | null,
): Promise<void> {
  setTripNotificationBooking(booking);
}

export async function syncTripNotificationSchedule(
  booking: BookingWithTravel | null,
): Promise<void> {
  setTripNotificationBooking(booking);
}

export async function clearTripNotification(): Promise<void> {
  if (typeof window === "undefined" || !isNativeApp()) return;
  try {
    const { LocalNotifications } = await import("@capacitor/local-notifications");
    await LocalNotifications.cancel({ notifications: [{ id: ONGOING_ID }] });
  } catch {
    /* ignore */
  }
}

/** Immediate celebration when a Piticot station unlocks. */
export async function notifyPiticotUnlock(stationTitle: string): Promise<void> {
  if (typeof window === "undefined" || !isNativeApp()) return;
  try {
    if (!(await ensurePermission())) return;
    await ensureChannels();
    await ensureActionTypes();
    const { LocalNotifications } = await import("@capacitor/local-notifications");
    await LocalNotifications.schedule({
      notifications: [
        {
          id: UNLOCK_ID,
          title: "Oprire deblocată!",
          body: stationTitle,
          largeBody: `Ai avansat pe tabla Piticot: ${stationTitle}.`,
          channelId: CHANNEL_PITICOT,
          actionTypeId: ACTION_PITICOT,
          extra: { route: "/inovatie/piticot/" },
          autoCancel: true,
        },
      ],
    });
  } catch {
    /* ignore */
  }
}

/**
 * Film-friendly sequence: 4 heads-up notifications spaced a few seconds apart.
 * Does not cancel the real itinerary schedule.
 */
export async function scheduleDemoNotificationSequence(
  booking: BookingWithTravel,
): Promise<void> {
  if (typeof window === "undefined" || !isNativeApp()) return;
  if (!booking.travel) return;
  if (!(await ensurePermission())) return;
  await ensureChannels();
  await ensureActionTypes();

  const { LocalNotifications } = await import("@capacitor/local-notifications");
  const travel = normalizeTravel(booking.travel);
  const now = Date.now();
  const day = travel.itinerary[0];
  const nextSlot = day?.slots[1] ?? day?.slots[0];

  const sequence: LocalNotificationSchema[] = [
    {
      id: DEMO_BASE,
      title: "Bine ai venit pe traseu",
      body: travel.title,
      largeBody: "Programul zilei e gata în Călătoria mea.",
      channelId: CHANNEL_REMINDERS,
      actionTypeId: ACTION_TRIP,
      schedule: { at: new Date(now + 10_000), allowWhileIdle: true },
      extra: { route: "/calatorie/" },
      autoCancel: true,
    },
    {
      id: DEMO_BASE + 1,
      title: nextSlot?.title ?? "Următoarea oprire",
      body: nextSlot
        ? `${nextSlot.time}${nextSlot.place ? ` · ${nextSlot.place}` : ""}`
        : "Deschide programul",
      largeBody: nextSlot?.detail ?? "Vezi ce urmează azi.",
      channelId: CHANNEL_REMINDERS,
      actionTypeId: ACTION_TRIP,
      schedule: { at: new Date(now + 25_000), allowWhileIdle: true },
      extra: { route: "/calatorie/" },
      autoCancel: true,
    },
    {
      id: DEMO_BASE + 2,
      title: "Pregătește scanarea QR",
      body: "Deschide Piticot la următoarea oprire",
      largeBody: "Scanează codul de pe teren ca să avansezi pe tablă.",
      channelId: CHANNEL_PITICOT,
      actionTypeId: ACTION_PITICOT,
      schedule: { at: new Date(now + 45_000), allowWhileIdle: true },
      extra: { route: "/inovatie/piticot/" },
      autoCancel: true,
    },
    {
      id: DEMO_BASE + 3,
      title: "Ziua merge bine",
      body: "Revino oricând la program și hartă",
      largeBody: "Notificările urmează opririle reale pe durata vacanței.",
      channelId: CHANNEL_REMINDERS,
      actionTypeId: ACTION_TRIP,
      schedule: { at: new Date(now + 70_000), allowWhileIdle: true },
      extra: { route: "/calatorie/" },
      autoCancel: true,
    },
  ];

  await LocalNotifications.cancel({
    notifications: [
      { id: DEMO_BASE },
      { id: DEMO_BASE + 1 },
      { id: DEMO_BASE + 2 },
      { id: DEMO_BASE + 3 },
    ],
  });
  await LocalNotifications.schedule({ notifications: sequence });
}

export async function bindTripNotificationLifecycle(): Promise<() => void> {
  if (!isNativeApp()) return () => {};

  try {
    const { App } = await import("@capacitor/app");
    const handle = await App.addListener("appStateChange", ({ isActive }) => {
      appInForeground = isActive;
      if (isActive) {
        void clearTripNotification();
      } else if (activeBooking?.travel) {
        void (async () => {
          try {
            if (!(await ensurePermission())) return;
            await ensureChannels();
            await ensureActionTypes();
            await showOngoingIfNeeded();
          } catch {
            /* ignore */
          }
        })();
      }
    });
    appInForeground = true;
    void clearTripNotification();
    return () => {
      void handle.remove();
    };
  } catch {
    return () => {};
  }
}

export async function bindTripNotificationOpen(
  openRoute: (path: string) => void,
): Promise<() => void> {
  if (!isNativeApp()) return () => {};
  try {
    const { LocalNotifications } = await import("@capacitor/local-notifications");
    const handle = await LocalNotifications.addListener(
      "localNotificationActionPerformed",
      (event) => {
        const actionId = event.actionId;
        if (actionId === "open_piticot") {
          openRoute("/inovatie/piticot/");
          return;
        }
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
