/** Live dashboard for the organiser: who is playing and where their piticot is. */
export function renderAdminPage(tripCode) {
  return `<!doctype html>
<html lang="ro">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Piticot · live</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link href="https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,500;0,700;0,800;1,500&display=swap" rel="stylesheet" />
<style>
  :root { --ink:#3a2a1c; --paper:#f4ead2; --bg:#efe2c2; --red:#b3261e; }
  * { box-sizing: border-box; }
  body { margin:0; background:var(--bg); color:var(--ink); font-family:Alegreya, Georgia, serif; }
  .folk { height:14px; background:
    linear-gradient(45deg, transparent 40%, #1f1a17 40% 60%, transparent 60%) 0 0/16px 14px,
    var(--red); border-block:1.5px solid var(--ink); }
  main { max-width:980px; margin:0 auto; padding:28px 24px 48px; }
  h1 { margin:0; font-size:2.6rem; font-weight:800; color:var(--red); line-height:1; }
  .sub { margin:6px 0 0; font-style:italic; font-size:1.1rem; }
  .stats { display:flex; gap:28px; margin:22px 0 8px; flex-wrap:wrap; }
  .stat b { display:block; font-size:2rem; line-height:1; }
  .stat span { font-size:.8rem; text-transform:uppercase; letter-spacing:.14em; opacity:.65; font-weight:700; }
  .grid { display:grid; grid-template-columns: 1.6fr 1fr; gap:32px; margin-top:20px; }
  @media (max-width: 760px) { .grid { grid-template-columns: 1fr; } }
  h2 { font-size:.85rem; text-transform:uppercase; letter-spacing:.16em; opacity:.7; margin:0 0 10px; }
  .player { display:flex; align-items:center; gap:14px; padding:12px 0; border-bottom:1.5px dashed #3a2a1c40; }
  .rank { width:28px; height:28px; border-radius:50%; display:grid; place-items:center; font-weight:800;
    background:var(--paper); border:2px solid var(--ink); flex:none; }
  .name { font-weight:800; font-size:1.25rem; flex:1; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .track { display:flex; gap:6px; }
  .dot { width:22px; height:22px; border-radius:50%; border:2px dashed #a38f6c; background:var(--paper); }
  .dot.on { border-style:solid; }
  .count { width:44px; text-align:right; font-weight:800; font-variant-numeric:tabular-nums; }
  .done { color:#4f8a3c; }
  .event { padding:8px 0; border-bottom:1px dashed #3a2a1c30; font-size:1.05rem; }
  .event time { font-size:.85rem; opacity:.6; margin-right:6px; font-variant-numeric:tabular-nums; }
  .empty { font-style:italic; opacity:.6; padding:12px 0; }
  .legend { display:flex; flex-wrap:wrap; gap:10px 18px; margin-top:6px; font-size:.95rem; }
  .legend i { display:inline-block; width:12px; height:12px; border-radius:50%; margin-right:6px; vertical-align:-1px; border:1.5px solid var(--ink); }
  .bar { display:flex; justify-content:space-between; align-items:center; margin-top:32px; font-size:.9rem; opacity:.75; }
  button { font:inherit; font-weight:700; background:none; border:none; color:var(--red); text-decoration:underline dotted; cursor:pointer; }
  .live { display:inline-block; width:9px; height:9px; border-radius:50%; background:#4f8a3c; margin-right:6px; }
  .live.off { background:#b3261e; }
  .flash { animation: flash 1.2s ease-out; }
  @keyframes flash { from { background:#e3a92f55; } to { background:transparent; } }
</style>
</head>
<body>
<div class="folk"></div>
<main>
  <h1>Piticot · live</h1>
  <p class="sub">Circuitul Piticotului · traseu <b>${tripCode}</b></p>
  <div class="stats">
    <div class="stat"><b id="s-players">0</b><span>jucători</span></div>
    <div class="stat"><b id="s-scans">0</b><span>scanări</span></div>
    <div class="stat"><b id="s-done">0</b><span>au terminat</span></div>
  </div>
  <div class="legend" id="legend"></div>
  <div class="grid">
    <section><h2>Clasament</h2><div id="players"></div></section>
    <section><h2>Ultimele scanări</h2><div id="events"></div></section>
  </div>
  <div class="bar">
    <span><span class="live" id="live"></span><span id="status">se conectează…</span></span>
    <button id="reset" type="button">șterge toți jucătorii</button>
  </div>
</main>
<div class="folk"></div>
<script>
  const CODE = ${JSON.stringify(tripCode)};
  let lastEventAt = null;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
  const time = (iso) => new Date(iso).toLocaleTimeString("ro-RO", { hour:"2-digit", minute:"2-digit", second:"2-digit" });

  async function tick() {
    try {
      const res = await fetch("/api/trips/" + CODE, { cache: "no-store" });
      const data = await res.json();
      render(data);
      document.getElementById("live").className = "live";
      document.getElementById("status").textContent = "live · actualizat " + time(new Date().toISOString());
    } catch {
      document.getElementById("live").className = "live off";
      document.getElementById("status").textContent = "server indisponibil";
    }
  }

  function render({ stations, players, events }) {
    const byId = Object.fromEntries(stations.map((s) => [s.id, s]));
    document.getElementById("legend").innerHTML = stations
      .map((s) => '<span><i style="background:' + s.accent + '"></i>' + esc(s.title) + "</span>").join("");
    document.getElementById("s-players").textContent = players.length;
    document.getElementById("s-scans").textContent = players.reduce((n, p) => n + p.unlocked.length, 0);
    document.getElementById("s-done").textContent = players.filter((p) => p.unlocked.length >= stations.length).length;

    document.getElementById("players").innerHTML = players.length ? players.map((p, i) => {
      const dots = stations.map((s) => p.unlocked.includes(s.id)
        ? '<span class="dot on" title="' + esc(s.title) + '" style="border-color:' + s.accent + ';background:' + s.accent + '55"></span>'
        : '<span class="dot" title="' + esc(s.title) + '"></span>').join("");
      const done = p.unlocked.length >= stations.length;
      return '<div class="player"><span class="rank">' + (i + 1) + '</span><span class="name">' + esc(p.nickname) +
        '</span><span class="track">' + dots + '</span><span class="count ' + (done ? "done" : "") + '">' +
        p.unlocked.length + "/" + stations.length + "</span></div>";
    }).join("") : '<p class="empty">Încă nu s-a alăturat nimeni. Deschide aplicația și pornește la drum.</p>';

    const newest = events[0]?.at ?? null;
    document.getElementById("events").innerHTML = events.length ? events.map((e, i) =>
      '<div class="event' + (i === 0 && newest !== lastEventAt && lastEventAt !== null ? " flash" : "") + '"><time>' + time(e.at) + "</time><b>" +
      esc(e.nickname) + "</b> a ajuns la " + esc(byId[e.stationId]?.title ?? e.stationId) + "</div>").join("")
      : '<p class="empty">Nicio scanare încă.</p>';
    lastEventAt = newest;
  }

  document.getElementById("reset").addEventListener("click", async () => {
    if (!confirm("Ștergi toți jucătorii și scanările?")) return;
    await fetch("/api/trips/" + CODE, { method: "DELETE" });
    tick();
  });

  tick();
  setInterval(tick, 2000);
</script>
</body>
</html>`;
}
