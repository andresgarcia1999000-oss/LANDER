# OMAR — Project Onboarding & 1:1 Swap Checklist

This repo is a **1:1 fork of the Purisaki lander template**. Everything currently here still says "Purisaki". The user wants to repurpose it for a different company by swapping pieces one at a time. Your job is to walk them through it.

## CRITICAL behavior rules

- **Ask for ONE piece at a time.** Don't dump the whole checklist on the user. Pick the next unswapped item, ask for the value, change it, confirm with the user, move on.
- **Never invent values.** Campaign IDs, webhook URLs, prices, brand names, domains — if the user hasn't told you, ask. No placeholders, no guessing.
- **After every change, push to GitHub and update HISTORY.md.** This is a standing user preference. Once GitHub is set up (item 1 below), commit + push after each meaningful swap.
- **Verify each change with `npm run build`** before committing.
- **Never deploy to Vercel without confirming the user has set up the new project + given you the token.** This is a fresh fork — there is no Vercel link yet.

## Stack

- Vanilla HTML + CSS + JS, bundled by Vite (`npm run build`, `npm run dev`)
- 4 lander entry points wired in [vite.config.js](vite.config.js): `/` (Spanish default), `/es`, `/pt`, `/fr`
- Quiz logic in [src/main.js](src/main.js) — 10-step funnel + dynamic SVG chart + body comparison + webhook POST
- Serverless API: [api/submit-quiz.js](api/submit-quiz.js) — Vercel function that forwards quiz payload to a webhook
- RedTrack click-attribution pixel in `<head>` of every lander
- Hosted on Vercel

## STANDING RULE — every new language requires 3 localized images

Before starting any new-language translation, **ALWAYS ask the user for**:
1. Localized **logo** → header image
2. Localized **70%-off product box image** → goes as the LAST image in the main advertorial page (right before the founder quote)
3. Localized **prognosis chart image** → goes inside the quiz "Your personalized prognosis" interstitial step

The product image at the very end of the checkout/results form must STAY the original universal textless image (`/images/form-product.png`) — do not replace it with a localized one.

---

## SWAP CHECKLIST — go through these in order, one at a time

### 1. GitHub repo
The local git is initialized but has no remote. Ask: **"What GitHub repo URL should I push this to? (Or do you want me to create a new one via `gh`?)"** Then `git remote add origin ...` and push. Don't proceed until this works — every later step depends on being able to push.

### 2. Vercel project
This fork is NOT linked to any Vercel project. Ask: **"When you're ready, give me your Vercel token + tell me what to name the new project."** First deploy will create it. Don't run `vercel` commands before this.

### 3. Custom domain
After the Vercel project exists, ask: **"What domain will the new lander run on (e.g. `theirdiet.com`)?"** Then either point it via Vercel dashboard (user does this manually) or via `vercel domains add` if they want you to.

### 4. Languages to keep
Currently shipping ES (default + `/es`), PT-BR (`/pt`), FR (`/fr`). Ask: **"Which languages does the new project need?"**
- Delete folders for languages they don't need.
- Remove their entries from [vite.config.js](vite.config.js).
- For new languages: trigger the standing rule above (request the 3 localized images first).

### 5. Product name
Currently: **Purisaki** — appears in titles, headlines, body copy, testimonial replies, study claims. Ask: **"What's the new product name?"** Then global-replace across all `*.html` files. Verify with `grep -r Purisaki`.

### 6. Brand / site name (header logo text alt)
Currently:
- ES: "Salud Pulse"
- PT: "Saúde Pulse"
- FR: "Santé Pulse"

Ask: **"What's the new site/brand name? Same name across languages or localized per language?"**

### 7. RedTrack tracker (per language)
Each lander has this in `<head>`:
```html
<script src="https://trk.yourdietreviews.com/unilpclick.js?attribution=lastpaid&cookiedomain=&cookieduration=90&defaultcampaignid=XXX&regviewonce=false"></script>
```

Current campaign IDs:
- ES: `69de7b4e734632dcf60ae89b`
- PT: `69e674ba0a796ad2582542ec`
- FR: `69e67a54d49d58c5422c64e1`
- Tracker host: `trk.yourdietreviews.com`

Ask: **"What's the new RedTrack tracker host?"** Then **"Give me one campaign ID per language."** Replace ALL.

### 8. Click-out URL (offer button on results page)
Search for `https://trk.yourdietreviews.com/click` — it's the `href` on every `class="offer-btn-gradient"` link in each lander. Ask: **"What's the new click-out URL?"** (Often this is a RedTrack `/click` redirect under their new tracker host.)

### 9. Webhook URL (quiz submissions)
[api/submit-quiz.js](api/submit-quiz.js) reads `process.env.WEBHOOK_URL`. Ask: **"What webhook should quiz submissions POST to?"** Tell the user to set it as an env var in the Vercel dashboard (don't hardcode a secret URL in code).

### 10. Product imagery
The repo currently uses Purisaki product photography in [public/images/](public/images/):
- `hero.png` — doctor + before/after
- `img3.png` — 3-step application
- `img4.png` — barberry branch (berberine source)
- `patch-users.png` — users wearing patch
- `carmen-week1.png` / `carmen-week2.png` / `carmen-week4.png` — testimonial progression
- `before-after.png` — grid
- `product-box.png` — universal product box (used in `/es` as last main-page image)
- `form-product.png` — universal textless product (KEEP as-is across all languages — this is the end-of-quiz image)
- `vid.mp4` / `img5.mov` — autoplay video
- Plus the per-language `logo-*`, `product-box-*`, `form-chart-*` files (see Standing Rule)

Ask: **"Will the new product replace all of these? Drop them in `public/images/` and tell me the filenames, or send them to me and I'll save them."**

### 11. Marketing copy (advertorial body)
The advertorial is full of Purisaki-specific claims:
- Transdermal patch + berberine mechanism
- "Stomach acid trap" hook
- Markus Hoffmann founder quote
- "University of Rosenheim" study
- Carmen 3-week transformation testimonial
- Specific numbered stats (82% / 67% / 93% / 71% etc)

Ask: **"Does the new product use the same advertorial structure (problem → mechanism → hero ingredient → proof → testimonials), or do you have your own copy to drop in?"** If they have new copy, work language-by-language with them.

### 12. Pricing
Currently: `49,99 €` crossed out → `24,99 €` (-70%) in every results page. Ask: **"What's the new regular price, sale price, currency, and discount %?"**

### 13. Quiz copy
The 10-step quiz (in each `*/index.html`) is product-agnostic enough that it usually doesn't need swapping unless the new product targets a different vertical. Ask: **"Is the new product also weight-loss-related? Or do we need to rewrite the quiz steps for a different category (e.g. skincare, supplement, fitness)?"**

### 14. Footer disclaimers
Footer mentions "Purisaki products are not intended to diagnose..." — same text, different product name. Sweep when product name changes.

### 15. Style / brand colors
Primary blue (`#035BFF`) is hardcoded in [src/style.css](src/style.css) and a few inline styles. Ask: **"What's the new brand color (or are we keeping blue)?"**

---

## When you're done with a checklist item

1. Run `npm run build` to verify HTML still parses.
2. Show the user what you changed (one or two sentences max).
3. Commit + push (once GitHub is set up).
4. Move to the next unswapped item.

## Files NOT to touch unless asked

- [src/main.js](src/main.js) — the quiz framework. Already handles `lang="es"`, `lang="pt"`, `lang="fr"` for date locale, fat-percentage prefix, and "Personal Diagnosis" string. Extend the language switch if a new language is added.
- [vite.config.js](vite.config.js) — only edit when adding/removing language entries.
- [package.json](package.json) — no dependency changes needed.
