// Piticot backend: players + progress for the circuit game, plus a live
// admin dashboard. Zero dependencies — run with `npm run piticot:server`.
import { createServer } from "node:http";
import { randomUUID } from "node:crypto";
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

const stations = getOrderedStations().map(({ id, title, accent, order }) => ({
  id,
  title,
  accent,
  order,
}));
const stationIds = new Set(stations.map((s) => s.id));

/** @typedef {{ id: string, deviceId: string, tripCode: string, nickname: string, unlocked: string[], unlockedAt: Record<string,string>, createdAt: string, updatedAt: string }} Player */
/** @typedef {{ at: string, playerId: string, nickname: string, stationId: string }} ScanEvent */

/** @type {{ players: Player[], events: ScanEvent[] }} */
let db = { players: [], events: [] };

function loadDb() {
  try {
    const parsed = JSON.parse(readFileSync(DB_FILE, "utf8"));
    db = { players: parsed.players ?? [], events: parsed.events ?? [] };
  } catch {
    db = { players: [], events: [] };
  }
}

function saveDb() {
  mkdirSync(dirname(DB_FILE), { recursive: true });
  const tmp = `${DB_FILE}.tmp`;
  writeFileSync(tmp, JSON.stringify(db, null, 2));
  renameSync(tmp, DB_FILE);
}

const normCode = (code) => String(code ?? "").trim().toUpperCase();
const cleanName = (name) => String(name ?? "").trim().slice(0, 40) || "Explorator";

function publicPlayer(p) {
  return {
    id: p.id,
    tripCode: p.tripCode,
    nickname: p.nickname,
    unlocked: p.unlocked,
    unlockedAt: p.unlockedAt,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
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
    "Access-Control-Allow-Headers": "Content-Type",
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
  ["GET", /^\/health$/, () => [200, { ok: true, name: "piticot", stations: stations.length }]],

  [
    "POST",
    /^\/api\/players$/,
    async (_m, body) => {
      const tripCode = normCode(body.tripCode);
      if (tripCode !== PITICOT_DEMO_CODE) return [400, { error: "Cod de traseu necunoscut" }];
      const deviceId = String(body.deviceId ?? "").slice(0, 80);
      const now = new Date().toISOString();
      let player = deviceId
        ? db.players.find((p) => p.deviceId === deviceId && p.tripCode === tripCode)
        : undefined;
      if (player) {
        player.nickname = cleanName(body.nickname);
        player.updatedAt = now;
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
      const [status, payload] = await handler(match, body);
      return send(res, status, payload);
    } catch (err) {
      return send(res, 400, { error: err instanceof Error ? err.message : "Cerere invalidă" });
    }
  }
  send(res, 404, { error: "Not found" });
});

server.listen(PORT, "0.0.0.0", () => {
  const ips = Object.values(networkInterfaces())
    .flat()
    .filter((n) => n && n.family === "IPv4" && !n.internal)
    .map((n) => n.address);
  console.log(`\nPiticot server pornit pe portul ${PORT}`);
  console.log(`  Admin (pe acest PC):  http://localhost:${PORT}/admin`);
  for (const ip of ips) {
    console.log(`  Din telefon / rețea:  http://${ip}:${PORT}   (aplicația: http://${ip}:${PORT}/app.apk)`);
  }
  console.log(`  Date salvate în:      ${DB_FILE}\n`);
});
