# OMAR — Session Notes (2026-05-01)

> **Purpose:** session-recovery doc. If the active Claude conversation is lost, a fresh session reading this + [CLAUDE.md](CLAUDE.md) + [HISTORY.md](HISTORY.md) should be able to pick up exactly where we left off.

---

## 1. What this project is

A **1:1 fork of the Purisaki lander template**, being repurposed for a new company. The user is running Google Ads to lead-gen / sell weight-loss patches and wants the same funnel structure but with completely separate plumbing (own GitHub, own Vercel, own RedTrack account, own domain).

**Stack:** vanilla HTML + CSS + JS, Vite-bundled, hosted on Vercel, RedTrack click-attribution + pixel.

---

## 2. Current live state

| Thing | Value |
|---|---|
| Live URL | https://dietreviewhub.com/ and https://dietreviewhub.com/es/ |
| GitHub repo | https://github.com/andresgarcia1999000-oss/LANDER (branch `main`) |
| Vercel project | `omar` under team `omars-projects-61a04961` |
| Custom domain | `dietreviewhub.com` (registered through Vercel itself — nameservers `ns1/ns2.vercel-dns.com`) |
| Languages | **ES only** (default `/` and `/es/`). PT and FR were dropped — user explicitly said "forget about English, just have ES live now" |
| RedTrack tracker host | `trk.dietreviewhub.com` (CNAME → `qm9iv.ttrk.io`, SSL via Let's Encrypt, valid through Jul 30 2026) |
| RedTrack ES campaign ID | `69f4fe9a187f0de37aedddeb` |
| RedTrack script | **`unilpclick.js`** (LP variant — auto-rewrites every `<a href^="trk.dietreviewhub.com/click">` to inject `?clickid=<value>` after page load) |
| Offer button click URL | `https://trk.dietreviewhub.com/click` (LP script does the clickid append) |

---

## 3. Checklist progress (against [CLAUDE.md](CLAUDE.md))

| # | Item | Status |
|---|---|---|
| 1 | GitHub repo | ✅ done |
| 2 | Vercel project | ✅ done |
| 3 | Custom domain | ✅ done |
| 4 | Languages (drop pt/fr, keep es) | ✅ done |
| 5 | Product name swap | 🟥 not started — still says "Purisaki" everywhere |
| 6 | Brand / site name (logo) | 🟥 still "Salud Pulse" |
| 7 | RedTrack tracker | ✅ done for ES |
| 8 | Click-out URL | ✅ done (button → `trk.dietreviewhub.com/click`) |
| 9 | Webhook URL | 🟥 not set; user said **"WE DONT CARE ABOUT QUIZ SUBMISSIONS"** — leave alone unless they change their mind |
| 10 | Product imagery | 🟥 still Purisaki photos |
| 11 | Marketing copy / claims / testimonials | 🟥 still Purisaki advertorial verbatim |
| 12 | Pricing (49,99 € → 24,99 €) | 🟥 unchanged |
| 13 | Quiz copy | 🟥 unchanged |
| 14 | Footer disclaimers | 🟥 unchanged |
| 15 | Brand color (`#035BFF`) | 🟥 unchanged |

**Plumbing is fully wired.** What remains is purely cosmetic / content (items 5–6, 10–15).

---

## 4. Gotchas — read these before doing anything

### 4a. RedTrack scripts: `unilpclick.js` vs `uniclick.js` are different

This caused 30+ minutes of confusion in this session. The LP variant **auto-rewrites all `<a>` tags pointing to `/click`** to append `?clickid=<value>` after the cookie is set. The universal variant does NOT.

If you ever swap the script tag, **always use `unilpclick.js`** for landers. The user was originally given `uniclick.js` from RedTrack and that broke the click flow.

### 4b. `trk.dietreviewhub.com/click` returning `{"status":0,"message":"empty clickid value"}` is NOT a bug

That's the expected response when there's no `clickid` query param AND no `rtkclickid-store` cookie. A real visitor lands on the lander first → `unilpclick.js` sets the cookie + rewrites the button href → click works. **Direct URL tests in incognito will always show this error**; do not chase it.

### 4c. The lander URL inside RedTrack must be `https://dietreviewhub.com/es/`

User initially had `trk.dietreviewhub.com/es` configured in RedTrack — a misconfiguration we wasted a round on. The lander URL field in a RedTrack campaign should be the **bare apex domain + path**, never the tracker subdomain.

### 4d. Local git credential cache is broken

The user's macOS keychain has cached GitHub credentials for an account `media868` that doesn't have access to `andresgarcia1999000-oss/LANDER`. Every push fails with 403 unless the token is embedded into the remote URL temporarily.

**Push recipe used throughout this session:**
```bash
source .env.local
git remote set-url origin "https://x-access-token:${GITHUB_TOKEN}@github.com/andresgarcia1999000-oss/LANDER.git"
git push
git remote set-url origin "https://github.com/andresgarcia1999000-oss/LANDER.git"
```

Long-term fix: user should update their macOS Keychain entry for `github.com` to the new account, OR we keep using the embed-strip pattern.

### 4e. Don't preemptively patch tracking issues — check vendor dashboard first

Twice in this session I went down code-side rabbit holes when the actual issue was RedTrack-side config. See [feedback_diagnose_before_patching memory](~/.claude/projects/-Users-mootez-Desktop-OMAR/memory/feedback_diagnose_before_patching.md). Always verify the campaign / lander URL / destination URL fields in RedTrack before adding any JS.

### 4f. `public/images/img5.mov` is 81 MB

Above GitHub's 50 MB recommended file size warning. Pushed fine but flagged for future. If we keep adding large videos, we may want git-lfs.

---

## 5. Secrets file: `.env.local`

Gitignored. User explicitly asked to be given a file to drop tokens in instead of pasting them into chat. Always read from `.env.local` first; only ask in chat for values that aren't there.

**Currently filled:** `GITHUB_TOKEN`, `VERCEL_TOKEN`, `VERCEL_PROJECT_NAME=omar`, `CUSTOM_DOMAIN=dietreviewhub.com`, `LANGUAGES=es,us` (the `us` is now obsolete — user said drop English), `REDTRACK_HOST=trk.dietreviewhub.com`, `REDTRACK_CAMPAIGN_ID_ES=69f4fe9a187f0de37aedddeb`, `CLICKOUT_URL=https://trk.dietreviewhub.com/click`.

**Currently blank:** `NEW_PRODUCT_NAME`, all `BRAND_NAME*`, `WEBHOOK_URL`, all `PRICE_*`, `BRAND_COLOR`, `REDTRACK_CAMPAIGN_ID_PT/FR` (intentionally — those landers were dropped).

---

## 6. Audit results (from end of session)

User asked to verify NOTHING from the old company remains. Confirmed clean:

- ✅ Zero hits on old RedTrack campaign IDs (`69de7b4e734632dcf60ae89b`, `69e674ba0a796ad2582542ec`, `69e67a54d49d58c5422c64e1`)
- ✅ Zero hits on old domain (`yourdietreviews`, `purisaki.com`)
- ✅ No 3rd-party trackers — only `unilpclick.js` is loaded
- ✅ External URLs in landers limited to: Google Fonts, NCBI/Pubmed citations (in body content), `trk.dietreviewhub.com`
- ✅ Vercel env vars empty for project `omar`
- ⚠️ Cosmetic only: `package.json` "name" is still `purisaki-clone` — never sent to browser, but worth renaming if user wants the file clean

---

## 7. Operating recipes

**Build:**
```bash
npm run build
```

**Deploy to prod (uses .env.local for token):**
```bash
source .env.local
npx vercel --prod --yes --scope=omars-projects-61a04961 --token="$VERCEL_TOKEN"
```

**Add a Vercel DNS record (e.g. for a tracker subdomain):**
```bash
source .env.local
npx vercel dns add dietreviewhub.com <subdomain> CNAME <target> --scope=omars-projects-61a04961 --token="$VERCEL_TOKEN"
```

**Bypass DNS cache when testing the new domain:**
- macOS: `sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder`
- Or use incognito + 5G off-Wi-Fi

---

## 8. What I (Claude) should NOT touch unless explicitly asked

(Per [CLAUDE.md](CLAUDE.md))

- `src/main.js` — the quiz framework. Already handles `lang="es"`, `lang="pt"`, `lang="fr"` (the `pt`/`fr` branches are now dead but harmless — left in place per the rule)
- `vite.config.js` — only edit when adding/removing language entries
- `package.json` — no dependency changes needed for swap work

---

## 9. Files of note

| File | Role |
|---|---|
| [CLAUDE.md](CLAUDE.md) | The swap checklist + standing rules. Read before doing anything. |
| [HISTORY.md](HISTORY.md) | Chronological changelog of every meaningful change. |
| [.env.local](.env.local) | All secrets / config values (gitignored) |
| [index.html](index.html) | Default ES lander (served at `/`) |
| [es/index.html](es/index.html) | Spanish lander (served at `/es/`) |
| [src/main.js](src/main.js) | Quiz funnel logic + body-comparison chart + checkout step |
| [api/submit-quiz.js](api/submit-quiz.js) | Vercel serverless function — POSTs quiz submissions to `WEBHOOK_URL` env var (currently unset, user doesn't care) |
| [vite.config.js](vite.config.js) | Build entry points (currently `/` and `/es/`) |

---

## 10. If user wants to continue, the highest-leverage next steps are

1. **Rename product** — global Purisaki → new-name sweep across HTML files. Just need `NEW_PRODUCT_NAME` in `.env.local`.
2. **Swap product imagery** — drop new images into `public/images/` overwriting same filenames, no code changes needed.
3. **Update brand name in header** — header logo says "Salud Pulse"; user can give one BRAND_NAME or per-language.
4. **Update pricing** — search/replace `49,99 €` and `24,99 €` once user gives new numbers.
5. **Marketing copy** — biggest task; user can choose to keep Purisaki structure with name swap OR provide entirely new copy.

User has been doing things one at a time and explicitly does not want a checklist dump in the chat — surface ONE next item, ask for the value, do it, push, move on.
