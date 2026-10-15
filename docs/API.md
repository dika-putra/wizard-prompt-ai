# API: `POST /api/generate`

Satu endpoint serverless (`api/generate.js`) yang melayani semua fitur AI di wizard. Browser hanya mengirim **jenis tugas** dan **data**. Prompt untuk model dirakit di server, sehingga endpoint tidak bisa dipakai untuk permintaan bebas.

## Request

```http
POST /api/generate
Content-Type: application/json
x-access-code: <kode>        # hanya jika ACCESS_CODE diatur

{ "task": "<jenis tugas>", "data": { ... } }
```

Ukuran `data` (setelah di-JSON-kan) maksimal 30.000 karakter. Setiap field teks juga dipotong di server sesuai batasnya.

## Response

Sukses:

```json
{ "result": { ... } }
```

Gagal:

```json
{ "error": "Pesan dalam bahasa Indonesia" }
```

| Status | Arti |
|---|---|
| 400 | Jenis tugas tidak dikenal |
| 401 | `ACCESS_CODE` aktif dan kode salah atau kosong |
| 405 | Metode selain POST |
| 413 | Data terlalu panjang |
| 429 | Rate limit per IP terlampaui, atau kuota penyedia AI habis |
| 500 | API key belum diatur |
| 502 | Penyedia AI error atau respons bukan JSON valid |

## Jenis tugas

### `scenes`: menyusun alur adegan

Dipakai tombol **Buat alur adegan dengan AI**.

```json
{
  "theme": "Petualangan di hutan",
  "setting": "a lush magical tropical forest ...",
  "mood": "cheerful and playful",
  "chars": ["Kiko (young boy, 7 years old, ...)"],
  "count": 5,
  "idea": "Kiko kehilangan kucingnya ...",
  "hemat": true
}
```

Hasil:

```json
{ "scenes": [ { "text": "...", "shot": "Wide shot", "cam": "Statis", "dialog": "Kiko: \"Ayo!\"" } ] }
```

- `count` dibatasi 1–12.
- `shot` dan `cam` divalidasi terhadap daftar label di server. Nilai yang tidak dikenal diganti `Medium shot` / `Statis`.
- Dengan `hemat: true`, aturan mode hemat kredit ikut dikirim ke model.

### `characters`: merapikan deskripsi karakter

Dipakai tombol **Rapikan & terjemahkan dengan AI**.

```json
{ "chars": [ { "name": "Kiko", "type": "Anak laki-laki", "age": "7 tahun", "look": "...", "outfit": "...", "trait": "..." } ] }
```

Hasil:

```json
{ "chars": [ { "name": "Kiko", "age": "7 years old", "look": "...", "outfit": "...", "trait": "..." } ] }
```

Urutan sama dengan input. Frontend hanya mengambil `age`, `look`, `outfit`, dan `trait`; nama tidak diubah.

### `fields`: terjemahan otomatis isian

Dipakai saat membuka halaman Hasil jika opsi *Prompt akhir otomatis bahasa Inggris* aktif. Frontend hanya mengirim isian yang terdeteksi berbahasa Indonesia dan belum ada di cache.

```json
{ "texts": ["kaos kuning, celana biru", "Kiko sedang duduk di bawah pohon"], "names": ["Kiko"], "hemat": true }
```

Hasil:

```json
{ "texts": ["yellow t-shirt, blue pants", "Kiko sits under a tree ..."] }
```

Maksimal 80 item, dan urutan hasil sama dengan input.

### `translate`: menerjemahkan teks adegan

Dipakai tombol **Terjemahkan ke bahasa Inggris** di langkah Adegan. Tombol ini hanya muncul jika terjemahan otomatis dimatikan. Hasil terjemahan menggantikan isian adegan.

Input dan output sama dengan `fields`, maksimal 12 item.

### `setting`: deskripsi latar tema baru

```json
{ "name": "Petualangan mencari harta karun di pulau", "setting": "" }
```

Hasil:

```json
{ "setting": "a small tropical island with ..." }
```

### `polish`: memperbaiki satu prompt

Dipakai tombol **✨ Perbaiki** di halaman Hasil.

```json
{ "kind": "image", "prompt": "...", "platform": "flow", "hemat": true }
```

- `kind`: `image`, `video` (image-to-video), `t2v`, atau `sheet`.
- `platform`: `flow` (struktur lengkap, ±170 kata) atau `canva` (satu paragraf, ±70 kata).

Hasil:

```json
{ "prompt": "..." }
```

## Penyedia AI

| `AI_PROVIDER` | Endpoint | Mode JSON |
|---|---|---|
| `gemini` (default) | `generativelanguage.googleapis.com/v1beta/models/{model}:generateContent` | `responseMimeType: application/json` |
| `groq` | `api.groq.com/openai/v1/chat/completions` | `response_format: json_object` |

Respons model dibersihkan dari *code fence*, lalu di-parse sebagai JSON. Jika gagal, server mencoba mengambil objek `{...}` pertama dari teks.

## Menambah tugas baru

1. Tambahkan `case "nama-tugas":` di fungsi `buildTask()` pada `api/generate.js`. Kembalikan string prompt yang meminta model menjawab dalam bentuk JSON tertentu.
2. Batasi dan potong semua input dengan helper `str()`.
3. Jika perlu, validasi hasil di `handler()` sebelum dikirim, seperti yang dilakukan untuk `scenes`.
4. Di `index.html`, panggil `await ai("nama-tugas", data, tombol)`. Fungsi ini sudah menangani kode akses, status loading, dan pesan error.
