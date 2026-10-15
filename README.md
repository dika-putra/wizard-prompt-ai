# Wizard Prompt Animasi

A web wizard that builds **Text → Image**, **Image → Video**, and **Text → Video** prompts scene by scene, ready to paste into **Google Flow** or **Canva** for making animated videos.

You can fill in the fields in Indonesian; the final prompt always comes out in English.

The app UI and the guides in `docs/` are in Indonesian.

## Features

**6-step wizard**

1. **Format**: prompt type (T2I, I2V, T2V), platform (Google Flow / Canva), aspect ratio (16:9, 9:16, 1:1), credit-saving mode, and automatic English prompts.
2. **Style**: 12 ready-made styles (3D Cartoon Pixar, 2D Anime, Claymation, Chibi, Storybook, Wayang & Batik, and more), your own, or **Ikuti gambar asli** ("Follow the original image") to animate your own image without changing its style. You can pick several styles at once, plus mood and lighting.
3. **Theme**: 10 ready-made story themes (forest, Ramadan, village, outer space, fable, and more), a **Joget & Dance** theme (14 dance types including funny ones, with tempo and venue options), or a custom one.
4. **Characters**: any number, each with name, type, age, appearance, clothing, and personality.
5. **Scenes**: 1 to 12 scenes (about 8 seconds each), filled in automatically from the theme and editable; shot type, camera movement, dialogue, and singing lines per scene.
6. **Result**: prompts per style and per scene, a *character sheet* prompt, a negative prompt, copy buttons, and a usage guide.

**AI features** (need a deployment with an API key)

- Generate a background description from a new theme idea.
- Clean up and translate character descriptions.
- Draft a scene flow from a story idea.
- Translate Indonesian fields into the English prompt automatically. Fields already in English are skipped, and dialogue stays in Indonesian.
- Fix a scene prompt (the **✨ Perbaiki** button, "Fix").

**Credit-saving mode** (for the free tier of Google Flow)

- Live warnings for scenes likely to fail: more than 2 characters, more than one action, dialogue that is too long, camera moves that tend to cause *morphing*, text in the image, eating or drinking scenes, and crowds.
- Extra instructions in the prompt for more stable results.
- Test a style on scene 1 before making it the final style.
- The same rules apply to the AI features.

All non-AI features work without an API key, even when the file is opened straight from disk.

## Project structure

```
.
├── index.html          # Wizard UI (HTML, CSS, and JS in one file)
├── api/
│   └── generate.js     # Vercel Serverless Function, calls Gemini / Groq
├── docs/
│   ├── API.md          # Docs for the /api/generate endpoint
│   └── PANDUAN.md      # Usage guide and Google Flow tips
├── .env.example        # Example environment variables
├── CHANGELOG.md        # Change history
├── package.json
└── README.md
```

There is no build step and no npm dependency.

## Quick start

### 1. Get an API key

- **Gemini (recommended)**: open [Google AI Studio](https://aistudio.google.com), then choose *Get API key* → *Create API key*.
- **Groq (alternative)**: open [console.groq.com](https://console.groq.com), then go to *API Keys*.

Free-tier quotas can change at any time. Check each provider's rate limit page.

### 2. Deploy to Vercel

**Through GitHub**

1. Push this repository to GitHub.
2. On [vercel.com](https://vercel.com), choose *Add New → Project* and select this repository.
3. Leave Framework Preset on *Other* and click *Deploy*.

**Through the terminal**

```bash
npm i -g vercel
vercel          # preview
vercel --prod   # production
```

### 3. Set environment variables

Go to *Project → Settings → Environment Variables* in Vercel:

| Variable | Required | Default | Description |
|---|---|---|---|
| `GEMINI_API_KEY` | Yes, if using Gemini | | API key from Google AI Studio |
| `AI_PROVIDER` | No | `gemini` | `gemini` or `groq` |
| `GROQ_API_KEY` | Yes, if `AI_PROVIDER=groq` | | API key from Groq |
| `ACCESS_CODE` | Recommended | empty | Code visitors must enter before using the AI features |
| `RATE_LIMIT` | No | `30` | Max requests per IP per 10 minutes |
| `GEMINI_MODEL` | No | `gemini-2.5-flash` | Change it when a newer model is available |
| `GROQ_MODEL` | No | `llama-3.3-70b-versatile` | Change it when a newer model is available |

After changing a variable, **Redeploy** so the change takes effect.

### 4. Run locally

Without the AI features, just open `index.html` in a browser.

With the AI features:

```bash
npm i -g vercel
vercel link
vercel env pull .env.local   # or copy .env.example to .env.local and fill it in
vercel dev                   # http://localhost:3000
```

## How it works

- Prompts are assembled in the browser from templates: style, theme, character, and camera choices are mapped to English phrases and joined together.
- Character consistency comes from including the full description of every character named in a scene. If no name is mentioned, all characters are included.
- The AI features call `POST /api/generate`. The model prompt is built on the server from the task type, so the endpoint cannot be used as a free-form chatbot. Details are in [docs/API.md](docs/API.md).
- Automatic translation uses a simple language check in the browser (common words and affixes). Results are cached, so only new or changed fields are translated again.
- All input is saved in the browser's `localStorage` under the key `wizard-prompt-animasi-v1`. Nothing is sent to the server except when you use an AI feature.

## Security

- Never put an API key in `index.html` or commit `.env*` files. `.gitignore` already excludes them.
- Turn on `ACCESS_CODE` if the site is public, so others cannot use up your API quota.
- The built-in rate limit is stored in memory per serverless instance, so it is *best effort*, not full protection.
- On free tiers, API providers may use the data you send to train models. Do not send sensitive data.

## More docs

- [docs/PANDUAN.md](docs/PANDUAN.md): usage guide and tips for saving credits in Google Flow (Indonesian).
- [docs/API.md](docs/API.md): endpoint spec and how to add a new AI task (Indonesian).
- [CHANGELOG.md](CHANGELOG.md): change history (Indonesian).
