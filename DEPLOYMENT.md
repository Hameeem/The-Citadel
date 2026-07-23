# Deployment Guide

This app has no backend and no environment secrets yet, so deployment is just
"build the static site and host it." Here's the full path from this folder to a
live URL, using GitHub + Vercel (free tier covers this comfortably).

## 1. Push to GitHub

```bash
cd citadel
git init
git add .
git commit -m "Initial commit: The Citadel foundation"
```

Create a new empty repository on GitHub (via github.com — no README/license, so it
stays empty), then:

```bash
git remote add origin https://github.com/YOUR_USERNAME/the-citadel.git
git branch -M main
git push -u origin main
```

## 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with your GitHub account.
2. Click **Add New → Project**, and select the `the-citadel` repo.
3. Vercel auto-detects Vite. Leave the defaults:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Click **Deploy**. You'll get a live `*.vercel.app` URL in about a minute.

Every future `git push` to `main` auto-redeploys — Vercel's GitHub integration
handles the CI/CD, so you don't need to hand-write GitHub Actions for basic
deployment. (A workflow file is included below in case you want a separate CI
check — e.g. running the build on every PR before merge.)

## Optional: GitHub Actions build check

`.github/workflows/build-check.yml` (included) runs `npm run build` on every push
and pull request, so broken builds get flagged before they reach `main`. This is a
*check*, not the deploy mechanism — Vercel's own GitHub integration handles deploys.

## Alternative: Cloudflare Pages

1. Go to the Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git**.
2. Select the repo.
3. Build command: `npm run build`, output directory: `dist`.
4. Deploy.

## Environment variables

None are required for the current build — see `.env.example`. It has a placeholder
for the Anthropic API key you'll need *if/when* you build the AI Arena feature
(battle analysis, fight simulation). Add it in Vercel under
**Project Settings → Environment Variables** when that feature exists; don't commit
a real key to the repo.
