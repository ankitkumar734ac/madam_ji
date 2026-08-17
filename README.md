# The Love Journey

A cinematic, mobile-first birthday experience built as a fast static website. It includes a mysterious prologue, grand birthday reveal, swipeable memory film, hidden notes, interactive love reasons, relationship timeline, animated envelope, optional music, false ending, and final surprise.

The full design and delivery approach is in [`PROJECT_PLAN.md`](PROJECT_PLAN.md).

## Personalize it

Almost everything you need to change is in [`config.js`](config.js):

- Her name and your sign-off
- Birthday and optional date lock
- Opening story lines
- Hero copy and portrait
- Photo memories and private stories
- Reasons you love her
- Relationship timeline
- Hidden notes and private jokes
- Love letter and birthday wish
- Gift clue and final message
- Optional music file

Add media using the filenames already listed in `config.js`, or change those paths to your own files:

```text
assets/
├── photos/
│   ├── hero.jpg
│   ├── memory-1.jpg ... memory-6.jpg
│   ├── timeline-1.jpg ... timeline-4.jpg
│   └── final-1.jpg ... final-3.jpg
└── audio/
    └── our-song.mp3
```

Missing images intentionally show attractive labeled placeholders, so you can replace photos one at a time without breaking the page.

## Birthday lock

In `config.js`, set:

```js
lockUntilBirthday: true
```

The site then displays a countdown until the configured birthday. To preview the complete experience before that date, use:

```text
index.html?preview=birthday
```

## Preview locally

Because the site uses JavaScript modules, serve it over HTTP instead of double-clicking `index.html`:

```powershell
python -m http.server 4173
```

Then open `http://localhost:4173`.

## Deploy

There is no build step. Push the repository and enable GitHub Pages from the repository root, or upload the same files to Cloudflare Pages, Netlify, or Vercel.

Before sharing, compress photographs to AVIF/WebP or optimized JPEG, confirm you have permission to use the chosen song, and complete the checklist in `PROJECT_PLAN.md`.
