// Vercel Routing Middleware: berjalan sebelum setiap request.
// Jika SITE_PASSWORD diatur, semua halaman dan API (kecuali /api/auth) butuh login.
import { authToken, COOKIE, readCookie, safeEqual } from "./lib/token.js";

export const config = { matcher: ["/((?!api/auth).*)"] };

export default async function middleware(request) {
  const password = process.env.SITE_PASSWORD;
  if (!password) return; // password tidak diatur: situs terbuka

  const token = readCookie(request.headers.get("cookie"), COOKIE);
  if (token && safeEqual(token, await authToken(password))) return; // sudah login, lanjutkan

  const url = new URL(request.url);
  if (url.pathname.startsWith("/api/")) {
    return new Response(JSON.stringify({ error: "Sesi login berakhir. Muat ulang halaman lalu masukkan password.", login: true }), {
      status: 401,
      headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
    });
  }
  return new Response(loginPage(url.searchParams.get("e")), {
    status: 401,
    headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" },
  });
}

function loginPage(code) {
  const msg = code === "1" ? "Password salah. Coba lagi." : code === "2" ? "Terlalu banyak percobaan. Tunggu beberapa menit." : "";
  return `<!DOCTYPE html>
<html lang="id"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex">
<title>Masuk · Wizard Prompt Animasi</title>
<style>
:root{--bg:#E9F0FB;--panel:#fff;--ink:#1B2550;--muted:#5B6488;--line:#CBD5EA;--sun:#F2B21B;--danger:#C2412D;color-scheme:light}
@media (prefers-color-scheme:dark){:root{--bg:#121733;--panel:#1C2347;--ink:#EEF1FF;--muted:#A3ABCF;--line:#323C6B;--sun:#F5BE3A;--danger:#F07862;color-scheme:dark}}
*{box-sizing:border-box}
body{margin:0;min-height:100vh;display:grid;place-items:center;background:var(--bg);color:var(--ink);font:15px/1.5 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;padding:20px}
form{width:100%;max-width:360px;background:var(--panel);border:1px solid var(--line);border-radius:18px;padding:26px}
h1{margin:0 0 4px;font-size:24px}
p{margin:0 0 18px;color:var(--muted)}
label{display:block;font-weight:600;font-size:13px;margin-bottom:6px}
input{width:100%;padding:12px;border-radius:10px;border:1px solid var(--line);background:var(--bg);color:var(--ink);font:inherit}
input:focus,button:focus-visible{outline:3px solid var(--sun);outline-offset:1px}
button{margin-top:14px;width:100%;padding:12px;border:none;border-radius:12px;background:var(--ink);color:var(--panel);font:inherit;font-weight:700;cursor:pointer}
.err{color:var(--danger);font-weight:600;font-size:14px;margin:12px 0 0}
</style></head>
<body><form method="POST" action="/api/auth">
<h1>🎬 Wizard Prompt Animasi</h1>
<p>Masukkan password untuk membuka wizard.</p>
<label for="pw">Password</label>
<input id="pw" name="password" type="password" autocomplete="current-password" required autofocus>
<button type="submit">Masuk</button>
${msg ? `<p class="err" role="alert">${msg}</p>` : ""}
</form></body></html>`;
}
