// POST /api/auth                 → login (form field "password")
// GET  /api/auth?action=logout   → logout
// GET  /api/auth?action=status   → { protected: boolean }
import { authToken, COOKIE, safeEqual } from "../lib/token.js";

const SESSION_DAYS = parseInt(process.env.SESSION_DAYS || "30", 10);
const MAX_ATTEMPTS = 10;              // per IP
const WINDOW_MS = 10 * 60 * 1000;     // per 10 menit
const attempts = new Map();

const secure = (req) => (String(req.headers["x-forwarded-proto"] || "").includes("https") ? "; Secure" : "");
function redirect(res, location) {
  res.statusCode = 303;
  res.setHeader("Location", location);
  res.setHeader("Cache-Control", "no-store");
  res.end();
}

export default async function handler(req, res) {
  const password = process.env.SITE_PASSWORD || "";
  const action = (req.query && req.query.action) || "";

  if (req.method === "GET" && action === "status") return res.status(200).json({ protected: !!password });

  if (req.method === "GET" && action === "logout") {
    res.setHeader("Set-Cookie", `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure(req)}`);
    return redirect(res, "/");
  }

  if (req.method !== "POST") return res.status(405).json({ error: "Metode tidak didukung." });
  if (!password) return redirect(res, "/");

  const ip = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "unknown";
  const now = Date.now();
  const list = (attempts.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  if (list.length >= MAX_ATTEMPTS) return redirect(res, "/?e=2");

  let body = req.body;
  if (typeof body === "string") body = Object.fromEntries(new URLSearchParams(body));
  const input = String((body && body.password) || "").slice(0, 200);

  const expected = await authToken(password);
  if (!safeEqual(await authToken(input), expected)) {
    list.push(now);
    attempts.set(ip, list);
    if (attempts.size > 5000) attempts.clear();
    return redirect(res, "/?e=1");
  }

  attempts.delete(ip);
  res.setHeader("Set-Cookie", `${COOKIE}=${expected}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_DAYS * 86400}${secure(req)}`);
  return redirect(res, "/");
}
