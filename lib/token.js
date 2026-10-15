// Helper bersama untuk middleware.js (Edge) dan api/auth.js (Node).
// Token sesi = HMAC-SHA256 dengan SITE_PASSWORD sebagai kunci, jadi:
// - password tidak pernah disimpan di cookie,
// - mengganti SITE_PASSWORD otomatis mengeluarkan semua sesi lama.

export const COOKIE = "wpa_auth";

export async function authToken(password) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(String(password)), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode("wizard-prompt-animasi:session:v1"));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Perbandingan dengan waktu konstan untuk string sepanjang sama.
export function safeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

export function readCookie(header, name) {
  for (const part of String(header || "").split(";")) {
    const i = part.indexOf("=");
    if (i > -1 && part.slice(0, i).trim() === name) return decodeURIComponent(part.slice(i + 1).trim());
  }
  return "";
}
