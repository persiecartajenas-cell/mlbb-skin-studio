# Skin Studio V2 — Fan Concept Workshop

A standalone, mobile-friendly concept editor for creating original fantasy-game skin ideas. This is not an injector and does not modify Mobile Legends or any other game's client.

## V2 features
- Role, rarity, theme, weapon, outfit, effects, and mood controls
- Live stylized 2.5D preview with color and glow customization
- Reference-image upload (images up to 2 MB are embedded in the browser's local storage when saved)
- AI image prompt builder, copy button, and prompt download
- Save, edit, duplicate, and delete concepts
- Export and import JSON backups
- PWA install/offline cache support

## Publish on GitHub Pages
Keep all files together in the repository root. In Settings > Pages choose `Deploy from a branch`, branch `main`, folder `/(root)`, and save. After publishing, open the HTTPS site on Android and use Install app/Add to Home screen.

## Actual AI image generation
This app builds prompts; it does not generate an image by itself. Connecting a real image-generation API requires an authorized service and a secure backend. Never place a private API key in `app.js` or any public GitHub repository.

## Local data
Concepts are stored in browser localStorage on the device/browser where they were created. Export a JSON backup regularly. Reference images can increase storage usage.

## Rights
Independent fan concept project, not affiliated with or endorsed by MOONTON. Use original artwork or images you have permission to use.
