// Vercel Serverless Function: POST /api/generate
// Body: { task: "scenes" | "characters" | "setting" | "polish", data: {...} }
// Prompt dirakit di server (bukan dikirim mentah dari browser), jadi endpoint ini
// tidak bisa dipakai orang lain sebagai chatbot gratis memakai kuota API-mu.

const PROVIDER = (process.env.AI_PROVIDER || "gemini").toLowerCase(); // "gemini" | "groq"
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
const ACCESS_CODE = process.env.ACCESS_CODE || "";          // kosongkan = tanpa kode akses
const RATE_LIMIT = parseInt(process.env.RATE_LIMIT || "30", 10); // request per IP per 10 menit
const WINDOW_MS = 10 * 60 * 1000;

// Harus sama persis dengan label di index.html
const SHOTS = ["Wide shot", "Medium shot", "Close-up", "Low angle", "Over the shoulder"];
const CAMS = ["Statis", "Zoom in perlahan", "Zoom out", "Pan kiri ke kanan", "Ikuti karakter", "Orbit", "Drone dari atas", "Close-up wajah", "Handheld"];

const SYSTEM = `You are an expert prompt engineer for AI image and video generation (Google Flow / Veo, Imagen, Canva).
Write all visual descriptions in clear, concrete English. Dialogue lines are written in Bahasa Indonesia.
Respond ONLY with valid JSON matching the requested shape. No markdown, no code fences, no commentary.`;

// Rate limit sederhana. Catatan: tersimpan di memori instance, jadi sifatnya "best effort".
const hits = new Map();
function limited(ip) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 5000) hits.clear();
  return list.length > RATE_LIMIT;
}

const str = (v, max = 600) => String(v ?? "").slice(0, max);

function buildTask(task, d = {}) {
  switch (task) {
    case "scenes": {
      const n = Math.min(Math.max(parseInt(d.count, 10) || 5, 1), 12);
      const chars = (Array.isArray(d.chars) ? d.chars : []).slice(0, 8).map((c) => str(c, 400)).join("\n- ");
      return `Write a short animated story as ${n} scenes.
Theme: ${str(d.theme, 200)}
Setting: ${str(d.setting, 500)}
Mood: ${str(d.mood, 60)}
Characters:
- ${chars || "(none given, invent one friendly main character)"}
${d.idea ? `Story idea from the user (may be in Indonesian): ${str(d.idea, 800)}` : ""}
${d.pov ? `This is a PROFESSION video about ${str(d.pov.role, 80)} (uniform: ${str(d.pov.uniform, 200)}; workplace: ${str(d.pov.setting, 200)}).
${d.pov.firstPerson ? `- FIRST-PERSON POV format: start every scene text with "POV as a ${str(d.pov.role, 80)}:" and describe what the viewer sees and does with their own hands. Never describe the viewer's face. Named characters are optional and appear only as people the viewer meets. Prefer cam "Handheld" or "Statis".` : "- The listed characters work as this profession, wearing the uniform."}
- Show realistic, positive, kid-friendly moments of the job (preparing, the main task, helping someone, a proud ending). No weapons, violence, injuries or gore.` : ""}
${d.dance ? `This is a DANCE video. Dance style: ${str(d.dance.name, 60)}, ${str(d.dance.tempo, 60)}${d.dance.funny ? ", funny and comedic with exaggerated cartoon expressions" : ""}.
Example moves: ${(Array.isArray(d.dance.moves) ? d.dance.moves : []).slice(0, 6).map((m) => str(m, 160)).join("; ")}.
- Each scene shows 1-2 simple dance moves with the full body visible. Mostly use shot "Wide shot" and cam "Statis".
- Start with the music beginning and end with a fun final pose.
- Optional "sing": a short catchy original line in Bahasa Indonesia (max 10 words) that a character sings, or "". Never use lyrics from existing songs.` : ""}

Rules:
- Each scene becomes ONE ~8-second video clip, so describe ONE clear, filmable visual action with emotion. 1-2 sentences.
- Use the characters' exact names. Do not re-describe their appearance (that is added separately).
- The story needs a beginning, a small problem, and a warm resolution.
- "shot" must be one of: ${SHOTS.join(" | ")}
- "cam" must be one of: ${CAMS.join(" | ")}
- "dialog": a short spoken line in Bahasa Indonesia, or "" if silent. Format "Name: line" when it is clear who speaks.
${d.hemat && d.dance ? "- Credit-saving dance rules: no spins, flips, jumps off the ground or acrobatics; moves stay in place." : ""}
${d.hemat ? `- CREDIT-SAVING MODE (free Google Flow), these rules are strict:
  * Exactly ONE action per scene. Never chain actions with "then", "after that", "finally".
  * At most 2 named characters per scene. Others may only appear as unnamed background.
  * Dialogue at most 12 words, or "".
  * Prefer cam "Statis", "Zoom in perlahan", "Pan kiri ke kanan" or "Ikuti karakter". Use "Orbit", "Drone dari atas" or "Handheld" only for the first or last scene.
  * Avoid visible text/signs/writing, eating or drinking, crowds, and characters handling small objects with their fingers.` : ""}

Return JSON: {"scenes":[{"text":"...","shot":"...","cam":"...","dialog":"..."${d.dance ? ',"sing":"..."' : ""}}]}`;
    }
    case "characters": {
      const chars = (Array.isArray(d.chars) ? d.chars : []).slice(0, 8).map((c) => ({
        name: str(c.name, 60), type: str(c.type, 40), age: str(c.age, 60),
        look: str(c.look, 300), outfit: str(c.outfit, 300), trait: str(c.trait, 200),
      }));
      return `Rewrite these character descriptions for consistent AI image generation.
- Translate any Indonesian into English.
- Make "look" and "outfit" specific and visual (exact colors, hair style, face shape, distinctive accessories) so the character looks identical in every image.
- Keep everything the user wrote; only add details where fields are vague or empty, and keep them fitting the character type.
- Keep "name" exactly unchanged. Keep each field short (under 25 words).

Input: ${JSON.stringify(chars)}

Return JSON: {"chars":[{"name":"...","age":"...","look":"...","outfit":"...","trait":"..."}]} in the same order.`;
    }
    case "translate": {
      const texts = (Array.isArray(d.texts) ? d.texts : []).slice(0, 12).map((t) => str(t, 600));
      const names = (Array.isArray(d.names) ? d.names : []).slice(0, 8).map((n) => str(n, 60)).filter(Boolean);
      return `Translate these animation scene descriptions from Indonesian into natural, visual English for AI video generation.
- Keep the meaning and the order of events exactly. Do not invent new events.
- Keep character names exactly as written${names.length ? ` (${names.join(", ")})` : ""}.
- Make it concrete and filmable: clear action, facial expression, body language. 1-2 sentences each.
- Translate Indonesian cultural terms naturally but keep the original word when it has no good equivalent (e.g. "takjil", "kampung", "becak") with a short visual hint.
${d.hemat ? "- Credit-saving mode: if a text contains several actions, keep only the main one and do not add actions." : ""}

Input (JSON array): ${JSON.stringify(texts)}

Return JSON: {"texts":["...", "..."]} with exactly ${texts.length} items in the same order.`;
    }
    case "fields": {
      const texts = (Array.isArray(d.texts) ? d.texts : []).slice(0, 80).map((t) => str(t, 600));
      const names = (Array.isArray(d.names) ? d.names : []).slice(0, 8).map((n) => str(n, 60)).filter(Boolean);
      return `You receive short text fields that a user typed for an animation prompt builder: scene descriptions, character details (age, looks, outfit, personality), a setting or an art style.
Translate each item into natural, concrete English suitable for AI image/video prompts.
- If an item is already English, return it unchanged.
- Keep the meaning; do not add new events, characters or details. Keep it about the same length.
- Keep character names exactly${names.length ? ` (${names.join(", ")})` : ""}.
- Keep Indonesian cultural terms that have no good equivalent (e.g. "takjil", "kampung", "becak", "peci") and add a short visual hint in parentheses.
- Scene items: phrase them as a clear filmable action with expression and body language.

Input (JSON array): ${JSON.stringify(texts)}

Return JSON: {"texts":[...]} with exactly ${texts.length} items in the same order.`;
    }
    case "setting":
      return `The user wants an animated video with this theme idea (may be in Indonesian): "${str(d.name, 300)}".
${d.setting ? `Their current setting notes: "${str(d.setting, 500)}"` : ""}
Write one rich, visual English description of the main location/world (25-45 words): place, key props, colors, time of day feel.
Return JSON: {"setting":"..."}`;
    case "polish": {
      const kind = { image: "text-to-image", video: "image-to-video", t2v: "text-to-video", sheet: "character reference sheet" }[d.kind] || "image";
      const short = d.platform === "canva";
      return `Improve this ${kind} prompt so it produces a more vivid, cinematic and consistent result.
- Keep every character name and appearance detail, the art style, aspect ratio and any dialogue exactly.
- Add concrete visual detail: expressions, body language, environment details, depth, color accents${kind.includes("video") ? ", motion timing and camera behavior" : ""}.
- ${short ? "Keep it compact: one paragraph, under 70 words." : "Keep the same labelled-line structure, under 170 words."}
- English only (except quoted dialogue).
- Keep any "Reference:" or "Starting frame:" line (or sentence about the attached character sheet) exactly as it is.
${d.hemat ? "- Credit-saving mode: keep exactly one action, do not add new actions, characters, text or signs, and keep camera motion simple." : ""}
${d.keepStyle ? "- The user animates their OWN image: never add art-style, rendering, lighting or color words. Keep the instruction to preserve the input image's original look exactly. Improve only motion, expression, camera and timing." : ""}

Prompt:
${str(d.prompt, 3000)}

Return JSON: {"prompt":"..."}`;
    }
    default:
      return null;
  }
}

async function callGemini(userPrompt) {
  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": process.env.GEMINI_API_KEY || "" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM }] },
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      generationConfig: { responseMimeType: "application/json", temperature: 0.9 },
    }),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw Object.assign(new Error(j?.error?.message || `Gemini error ${r.status}`), { status: r.status });
  return j?.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("") || "";
}

async function callGroq(userPrompt) {
  const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.GROQ_API_KEY || ""}` },
    body: JSON.stringify({
      model: GROQ_MODEL,
      temperature: 0.9,
      response_format: { type: "json_object" },
      messages: [{ role: "system", content: SYSTEM }, { role: "user", content: userPrompt }],
    }),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw Object.assign(new Error(j?.error?.message || `Groq error ${r.status}`), { status: r.status });
  return j?.choices?.[0]?.message?.content || "";
}

function parseJSON(text) {
  const clean = text.replace(/```json|```/g, "").trim();
  try { return JSON.parse(clean); } catch {}
  const m = clean.match(/\{[\s\S]*\}/);
  if (m) return JSON.parse(m[0]);
  throw new Error("Respons AI bukan JSON yang valid.");
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Gunakan metode POST." });

  if (ACCESS_CODE && req.headers["x-access-code"] !== ACCESS_CODE)
    return res.status(401).json({ error: "Kode akses salah atau belum diisi." });

  const ip = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "unknown";
  if (limited(ip)) return res.status(429).json({ error: "Terlalu banyak permintaan. Coba lagi beberapa menit lagi." });

  const keyMissing = PROVIDER === "groq" ? !process.env.GROQ_API_KEY : !process.env.GEMINI_API_KEY;
  if (keyMissing) return res.status(500).json({ error: `API key untuk ${PROVIDER} belum diatur di Environment Variables Vercel.` });

  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch { body = {}; } }
  const { task, data } = body || {};
  if (JSON.stringify(data || {}).length > 30000) return res.status(413).json({ error: "Data terlalu panjang." });

  const userPrompt = buildTask(task, data);
  if (!userPrompt) return res.status(400).json({ error: "Jenis tugas tidak dikenal." });

  try {
    const text = PROVIDER === "groq" ? await callGroq(userPrompt) : await callGemini(userPrompt);
    const result = parseJSON(text);

    if (task === "scenes" && Array.isArray(result.scenes)) {
      result.scenes = result.scenes.slice(0, 12).map((s) => ({
        text: str(s.text, 600),
        shot: SHOTS.includes(s.shot) ? s.shot : "Medium shot",
        cam: CAMS.includes(s.cam) ? s.cam : "Statis",
        dialog: str(s.dialog, 300),
        sing: str(s.sing, 200),
      }));
    }
    return res.status(200).json({ result });
  } catch (e) {
    const quota = e.status === 429;
    return res.status(quota ? 429 : 502).json({
      error: quota ? "Kuota API gratis sedang habis. Tunggu sebentar lalu coba lagi." : `Gagal memanggil AI: ${e.message}`,
    });
  }
}
