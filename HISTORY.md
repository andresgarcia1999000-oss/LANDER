# Project History

## 2026-04-28 — Forked from Purisaki lander template
- Cloned the Purisaki lander framework (vanilla HTML + Vite + 4-language quiz funnel + Vercel webhook) as the starting template
- Stripped session artifacts: `.git`, `.vercel`, `node_modules`, `dist`, `gemini.md`, old `HISTORY.md`, `convo/`, `architecture/`, `tools/`, etc.
- Initialized fresh git repo
- See [CLAUDE.md](CLAUDE.md) for the 1:1 swap checklist

## 2026-05-01 — GitHub remote configured (checklist item 1)
- Renamed local branch `master` → `main`
- Added GitHub remote: https://github.com/andresgarcia1999000-oss/LANDER
- Pushed initial commits to `origin/main`
- Note: `public/images/img5.mov` is 81 MB (above GitHub's 50 MB warning threshold) — pushed fine but flagged for future

## 2026-05-01 — Secrets file added
- Created `.env.local` (gitignored) with placeholder slots for every secret/config the swap checklist needs
- Updated `.gitignore` to also exclude `.env.local` and `.env.*.local` patterns
- Going forward: drop tokens/IDs in `.env.local` instead of pasting in chat

## 2026-05-01 — Trimmed to ES-only (checklist item 4)
- Deleted `pt/` and `fr/` lander folders
- Removed `pt` and `fr` entries from [vite.config.js](vite.config.js)
- Deleted orphaned per-language images: `logo-pt.{jpg,png}`, `logo-fr.jpg`, `product-box-pt.png`, `product-box-fr.jpg`, `form-chart-{pt,fr}.jpg`
- Build verified — produces `/` (default ES) and `/es` only
- Note: pt/fr branches still exist inside [src/main.js](src/main.js) language switch but are now dead — left untouched per CLAUDE.md rule

## 2026-05-01 — First Vercel deploy + custom domain (checklist items 2 & 3)
- Created Vercel project `omar` under team `omars-projects-61a04961`
- Deployed to prod: https://omar-puce.vercel.app
- Attached custom domain `dietreviewhub.com` (registered through Vercel — nameservers already pointing to ns1/ns2.vercel-dns.com, no registrar changes needed)
- Verified: `https://dietreviewhub.com` returns HTTP 200 via Vercel edge
- ⚠ Content is still 100% Purisaki — RedTrack tracker, click-out URL, webhook, product imagery, copy all need swapping (checklist items 5–15)
- ⚠ `WEBHOOK_URL` env var not yet set in Vercel — quiz submissions will fail until it is
