// RoHub API: accounts, demo bookings, Piticot progress, admin dashboard.
// Zero dependencies — run with `npm run piticot:server`.
import { createServer } from "node:http";
import {
  createHash,
  randomBytes,
  randomUUID,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";
import { mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { networkInterfaces } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PITICOT_DEMO_CODE, getOrderedStations } from "../src/lib/piticot.ts";
import { renderAdminPage } from "./admin-page.mjs";

const PORT = Number(process.env.PORT ?? 4000);
const HERE = dirname(fileURLToPath(import.meta.url));
const DB_FILE = process.env.PITICOT_DB ?? join(HERE, "data", "piticot-db.json");
const APK_FILE = join(HERE, "..", "private", "app", "RoHubTravel.apk");
const SESSION_DAYS = 30;
const DEMO_TRAVELS = JSON.parse(
  readFileSync(join(HERE, "../src/lib/demo-travels.json"), "utf8"),
);

const stations = getOrderedStations().map(({ id, title, accent, order }) => ({
  id,
  title,
  accent,
  order,
}));
const stationIds = new Set(stations.map((s) => s.id));
const travelById = new Map(DEMO_TRAVELS.map((t) => [t.id, t]));

/**
 * @typedef {{ id: string, email: string, passwordHash: string, name: string, createdAt: string }} User
 * @typedef {{ tokenHash: string, userId: string, expiresAt: string }} Session
 * @typedef {{ id: string, userId: string, travelId: string, status: "confirmed", startsOn: string, endsOn: string, nickname: string, createdAt: string }} Booking
 * @typedef {{ id: string, deviceId: string, tripCode: string, nickname: string, unlocked: string[], unlockedAt: Record<string,string>, createdAt: string, updatedAt: string, userId?: string }} Player
 * @typedef {{ at: string, playerId: string, nickname: string, stationId: string }} ScanEvent
 */

/** @type {{ users: User[], sessions: Session[], bookings: Booking[], players: Player[], events: ScanEvent[] }} */
let db = { users: [], sessions: [], bookings: [], players: [], events: [] };

function loadDb() {
  try {
    const parsed = JSON.parse(readFileSync(DB_FILE, "utf8"));
    db = {
      users: parsed.users ?? [],
      sessions: parsed.sessions ?? [],
      bookings: parsed.bookings ?? [],
      players: parsed.players ?? [],
      events: parsed.events ?? [],
    };
  } catch {
    db = { users: [], sessions: [], bookings: [], players: [], events: [] };
  }
  pruneSessions();
}

function saveDb() {
  mkdirSync(dirname(DB_FILE), { recursive: true });
  const tmp = `${DB_FILE}.tmp`;
  writeFileSync(tmp, JSON.stringify(db, null, 2));
  renameSync(tmp, DB_FILE);
}

const normCode = (code) => String(code ?? "").trim().toUpperCase();
const cleanName = (name) => String(name ?? "").trim().slice(0, 40) || "Explorator";
const normEmail = (email) => String(email ?? "").trim().toLowerCase();

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  const [salt, hash] = String(stored).split(":");
  if (!salt || !hash) return false;
  const next = scryptSync(password, salt, 64);
  const prev = Buffer.from(hash, "hex");
  if (prev.length !== next.length) return false;
  return timingSafeEqual(prev, next);
}

function hashToken(token) {
  return createHash("sha256").update(token).digest("hex");
}

function pruneSessions() {
  const now = Date.now();
  db.sessions = db.sessions.filter((s) => Date.parse(s.expiresAt) > now);
}

function publicUser(u) {
  return { id: u.id, email: u.email, name: u.name, createdAt: u.createdAt };
}

function publicBooking(b) {
  const travel = travelById.get(b.travelId) ?? null;
  return {
    id: b.id,
    travelId: b.travelId,
    status: b.status,
    startsOn: b.startsOn,
    endsOn: b.endsOn,
    nickname: b.nickname,
    createdAt: b.createdAt,
    travel,
  };
}

function publicPlayer(p) {
  return {
    id: p.id,
    tripCode: p.tripCode,
    nickname: p.nickname,
    unlocked: p.unlocked,
    unlockedAt: p.unlockedAt,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
    userId: p.userId ?? null,
  };
}

function createSession(userId) {
  pruneSessions();
  const token = randomUUID() + randomUUID().replace(/-/g, "");
  const expires = new Date();
  expires.setDate(expires.getDate() + SESSION_DAYS);
  db.sessions.push({
    tokenHash: hashToken(token),
    userId,
    expiresAt: expires.toISOString(),
  });
  return token;
}

function userFromAuth(req) {
  const header = String(req.headers.authorization ?? "");
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!match) return null;
  pruneSessions();
  const tokenHash = hashToken(match[1].trim());
  const session = db.sessions.find((s) => s.tokenHash === tokenHash);
  if (!session) return null;
  return db.users.find((u) => u.id === session.userId) ?? null;
}

function requireUser(req) {
  const user = userFromAuth(req);
  if (!user) {
    const err = new Error("Neautentificat");
    err.status = 401;
    throw err;
  }
  return user;
}

function activeBookingFor(userId) {
  const today = new Date().toISOString().slice(0, 10);
  return (
    db.bookings.find(
      (b) =>
        b.userId === userId &&
        b.status === "confirmed" &&
        b.endsOn >= today,
    ) ?? null
  );
}

/** Merge incoming unlocks (union) and log new scan events. */
function mergeProgress(player, unlocked, unlockedAt) {
  const now = new Date().toISOString();
  for (const id of Array.isArray(unlocked) ? unlocked : []) {
    if (!stationIds.has(id) || player.unlocked.includes(id)) continue;
    player.unlocked.push(id);
    const at = typeof unlockedAt?.[id] === "string" ? unlockedAt[id] : now;
    player.unlockedAt[id] = at;
    db.events.push({ at, playerId: player.id, nickname: player.nickname, stationId: id });
  }
  if (db.events.length > 500) db.events = db.events.slice(-500);
  player.updatedAt = now;
}

function tripSummary(code) {
  const players = db.players
    .filter((p) => p.tripCode === code)
    .sort(
      (a, b) =>
        b.unlocked.length - a.unlocked.length ||
        a.updatedAt.localeCompare(b.updatedAt),
    )
    .map(publicPlayer);
  const events = db.events
    .filter((e) => players.some((p) => p.id === e.playerId))
    .slice(-30)
    .reverse();
  return { code, stations, players, events };
}

function send(res, status, body, type = "application/json; charset=utf-8") {
  res.writeHead(status, {
    "Content-Type": type,
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Cache-Control": "no-store",
  });
  res.end(type.startsWith("application/json") ? JSON.stringify(body) : body);
}

async function readJson(req) {
  let raw = "";
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > 64_000) throw new Error("Body too large");
  }
  return raw ? JSON.parse(raw) : {};
}

const routes = [
  [
    "GET",
    /^\/health$/,
    () => [
      200,
      {
        ok: true,
        name: "rohub",
        stations: stations.length,
        travels: DEMO_TRAVELS.length,
      },
    ],
  ],

  [
    "POST",
    /^\/api\/auth\/register$/,
    (_m, body) => {
      const email = normEmail(body.email);
      const password = String(body.password ?? "");
      const name = cleanName(body.name);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return [400, { error: "Email invalid" }];
      }
      if (password.length < 6) {
        return [400, { error: "Parola trebuie să aibă cel puțin 6 caractere" }];
      }
      if (db.users.some((u) => u.email === email)) {
        return [409, { error: "Există deja un cont cu acest email" }];
      }
      const user = {
        id: randomUUID(),
        email,
        passwordHash: hashPassword(password),
        name,
        createdAt: new Date().toISOString(),
      };
      db.users.push(user);
      const token = createSession(user.id);
      saveDb();
      return [201, { token, user: publicUser(user) }];
    },
  ],

  [
    "POST",
    /^\/api\/auth\/login$/,
    (_m, body) => {
      const email = normEmail(body.email);
      const password = String(body.password ?? "");
      const user = db.users.find((u) => u.email === email);
      if (!user || !verifyPassword(password, user.passwordHash)) {
        return [401, { error: "Email sau parolă greșită" }];
      }
      const token = createSession(user.id);
      saveDb();
      return [200, { token, user: publicUser(user) }];
    },
  ],

  [
    "GET",
    /^\/api\/auth\/me$/,
    (_m, _body, req) => {
      const user = requireUser(req);
      const booking = activeBookingFor(user.id);
      return [
        200,
        {
          user: publicUser(user),
          activeBooking: booking ? publicBooking(booking) : null,
        },
      ];
    },
  ],

  [
    "POST",
    /^\/api\/auth\/logout$/,
    (_m, _body, req) => {
      const header = String(req.headers.authorization ?? "");
      const match = header.match(/^Bearer\s+(.+)$/i);
      if (match) {
        const tokenHash = hashToken(match[1].trim());
        db.sessions = db.sessions.filter((s) => s.tokenHash !== tokenHash);
        saveDb();
      }
      return [200, { ok: true }];
    },
  ],

  ["GET", /^\/api\/travels$/, () => [200, { travels: DEMO_TRAVELS }]],

  [
    "GET",
    /^\/api\/travels\/([\w-]+)$/,
    (m) => {
      const travel = travelById.get(m[1]);
      return travel ? [200, travel] : [404, { error: "Călătorie inexistentă" }];
    },
  ],

  [
    "POST",
    /^\/api\/bookings$/,
    (_m, body, req) => {
      const user = requireUser(req);
      const travelId = String(body.travelId ?? "");
      const travel = travelById.get(travelId);
      if (!travel) return [404, { error: "Călătorie inexistentă" }];
      if (activeBookingFor(user.id)) {
        return [409, { error: "Ai deja o călătorie activă" }];
      }
      const booking = {
        id: randomUUID(),
        userId: user.id,
        travelId: travel.id,
        status: "confirmed",
        startsOn: travel.startsOn,
        endsOn: travel.endsOn,
        nickname: cleanName(body.nickname || user.name),
        createdAt: new Date().toISOString(),
      };
      db.bookings.push(booking);
      saveDb();
      return [201, publicBooking(booking)];
    },
  ],

  [
    "GET",
    /^\/api\/bookings\/mine$/,
    (_m, _body, req) => {
      const user = requireUser(req);
      const list = db.bookings
        .filter((b) => b.userId === user.id)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .map(publicBooking);
      const active = activeBookingFor(user.id);
      return [
        200,
        {
          bookings: list,
          activeBooking: active ? publicBooking(active) : null,
        },
      ];
    },
  ],

  [
    "DELETE",
    /^\/api\/bookings\/mine\/active$/,
    (_m, _body, req) => {
      const user = requireUser(req);
      const active = activeBookingFor(user.id);
      if (!active) return [404, { error: "Nicio călătorie activă" }];
      db.bookings = db.bookings.filter((b) => b.id !== active.id);
      saveDb();
      return [200, { ok: true }];
    },
  ],

  [
    "GET",
    /^\/api\/admin\/overview$/,
    () => [
      200,
      {
        users: db.users.map(publicUser),
        bookings: db.bookings.map(publicBooking),
        players: db.players.map(publicPlayer),
      },
    ],
  ],

  [
    "DELETE",
    /^\/api\/admin\/bookings$/,
    () => {
      db.bookings = [];
      saveDb();
      return [200, { ok: true }];
    },
  ],

  [
    "POST",
    /^\/api\/players$/,
    async (_m, body, req) => {
      const tripCode = normCode(body.tripCode);
      if (tripCode !== PITICOT_DEMO_CODE) return [400, { error: "Cod de traseu necunoscut" }];
      const deviceId = String(body.deviceId ?? "").slice(0, 80);
      const authUser = userFromAuth(req);
      const now = new Date().toISOString();
      let player =
        (authUser
          ? db.players.find((p) => p.userId === authUser.id && p.tripCode === tripCode)
          : undefined) ??
        (deviceId
          ? db.players.find((p) => p.deviceId === deviceId && p.tripCode === tripCode)
          : undefined);
      if (player) {
        player.nickname = cleanName(body.nickname);
        player.updatedAt = now;
        if (authUser) player.userId = authUser.id;
      } else {
        player = {
          id: randomUUID(),
          deviceId: deviceId || randomUUID(),
          tripCode,
          nickname: cleanName(body.nickname),
          unlocked: [],
          unlockedAt: {},
          createdAt: now,
          updatedAt: now,
          userId: authUser?.id,
        };
        db.players.push(player);
      }
      mergeProgress(player, body.unlocked, body.unlockedAt);
      saveDb();
      return [200, publicPlayer(player)];
    },
  ],

  [
    "GET",
    /^\/api\/players\/([\w-]+)$/,
    (m) => {
      const player = db.players.find((p) => p.id === m[1]);
      return player ? [200, publicPlayer(player)] : [404, { error: "Jucător inexistent" }];
    },
  ],

  [
    "PUT",
    /^\/api\/players\/([\w-]+)\/progress$/,
    (m, body) => {
      const player = db.players.find((p) => p.id === m[1]);
      if (!player) return [404, { error: "Jucător inexistent" }];
      mergeProgress(player, body.unlocked, body.unlockedAt);
      saveDb();
      return [200, publicPlayer(player)];
    },
  ],

  [
    "DELETE",
    /^\/api\/players\/([\w-]+)$/,
    (m) => {
      db.players = db.players.filter((p) => p.id !== m[1]);
      db.events = db.events.filter((e) => e.playerId !== m[1]);
      saveDb();
      return [200, { ok: true }];
    },
  ],

  ["GET", /^\/api\/trips\/([\w-]+)$/, (m) => [200, tripSummary(normCode(m[1]))]],

  [
    "DELETE",
    /^\/api\/trips\/([\w-]+)$/,
    (m) => {
      const code = normCode(m[1]);
      const ids = new Set(db.players.filter((p) => p.tripCode === code).map((p) => p.id));
      db.players = db.players.filter((p) => !ids.has(p.id));
      db.events = db.events.filter((e) => !ids.has(e.playerId));
      saveDb();
      return [200, { ok: true }];
    },
  ],
];

loadDb();

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", "http://localhost");
  const path = url.pathname.replace(/\/+$/, "") || "/";

  if (req.method === "OPTIONS") return send(res, 204, "", "text/plain");
  if (req.method === "GET" && path === "/app.apk") {
    try {
      const apk = readFileSync(APK_FILE);
      res.writeHead(200, {
        "Content-Type": "application/vnd.android.package-archive",
        "Content-Disposition": 'attachment; filename="RoHubTravel.apk"',
        "Content-Length": apk.length,
      });
      return res.end(apk);
    } catch {
      return send(res, 404, { error: "APK not built yet. Run npm run app:build." });
    }
  }
  if (req.method === "GET" && (path === "/" || path === "/admin")) {
    return send(res, 200, renderAdminPage(PITICOT_DEMO_CODE), "text/html; charset=utf-8");
  }

  for (const [method, pattern, handler] of routes) {
    if (req.method !== method) continue;
    const match = path.match(pattern);
    if (!match) continue;
    try {
      const body = method === "POST" || method === "PUT" ? await readJson(req) : {};
      const [status, payload] = await handler(match, body, req);
      return send(res, status, payload);
    } catch (err) {
      const status = err?.status === 401 ? 401 : 400;
      return send(res, status, {
        error: err instanceof Error ? err.message : "Cerere invalidă",
      });
    }
  }
  send(res, 404, { error: "Not found" });
});

server.listen(PORT, "0.0.0.0", () => {
  const ips = Object.values(networkInterfaces())
    .flat()
    .filter((n) => n && n.family === "IPv4" && !n.internal)
    .map((n) => n.address);
  console.log(`\nRoHub API pornit pe portul ${PORT}`);
  console.log(`  Admin (pe acest PC):  http://localhost:${PORT}/admin`);
  for (const ip of ips) {
    console.log(`  Din telefon / rețea:  http://${ip}:${PORT}   (APK: http://${ip}:${PORT}/app.apk)`);
  }
  console.log(`  Date salvate în:      ${DB_FILE}\n`);
});
