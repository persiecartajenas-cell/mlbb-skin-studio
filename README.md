# MLBB Skin Studio — Starter Project

A fan-made, standalone skin-concept editor. It is **not** an injector and does not modify the Mobile Legends game client, unlock paid content, or alter online matches.

## Included
- Hero-role and theme selectors
- Custom color palette and visual-effect fields
- Abstract live concept preview
- AI-ready prompt builder (copy/paste into an image generator)
- Save concepts locally in the browser
- Export saved concepts as JSON
- PWA manifest and service worker for installation when hosted securely

## Quick start on a computer
1. Extract the ZIP.
2. Open `index.html` in a browser to test most features.
3. For PWA install/offline support, serve the folder over HTTPS or localhost. Opening the file directly (`file://`) will not enable service-worker installation.
4. Do not put API keys in browser JavaScript. If you later connect an AI image API, route requests through a secure backend.

## Android installation (PWA)
A PWA needs to be hosted on an HTTPS website (localhost is also accepted for development). One simple hosting route:
1. Create a GitHub repository and upload all files from this folder.
2. In repository settings, enable GitHub Pages for the main branch and root folder.
3. Wait for the published HTTPS address.
4. Open that address in Chrome on Android.
5. Open Chrome's menu and choose **Install app** or **Add to Home screen**.
6. Launch Skin Studio from your home screen.

The exact menu wording can vary by browser and Android version. Keep `index.html`, `styles.css`, `app.js`, `manifest.webmanifest`, `service-worker.js`, and `icon.svg` together in the same folder.

## Data and privacy
Saved concepts are stored in the browser's local storage on that device. Use **Export JSON** to make a backup. Clearing browser site data may remove saved concepts.

## Rights and branding
This is an independent fan concept tool, not affiliated with or endorsed by MOONTON. Avoid distributing copyrighted game assets without permission. Use original artwork or assets you have rights to use.
