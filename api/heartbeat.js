export default function handler(req, res) {
  res.status(200).json({
    status: "ok",
    agent: "sentinel-x",
    uptime: "99.9%",
    lastCycle: "2026-05-27T23:45:01Z",
    activeAgents: 4,
    queueHealth: "stable",
    runtime: "autonomous",
  });
}
