# Bing Bong

Chaotic top-and-bottom Pong with 22 power-ups, robots and a poop for a ball.
It's a single-page web app (PWA): add it to an iPhone or iPad home screen and it runs full screen, works offline, and remembers your settings.

**Play:** https://mdg8181.github.io/BingBong/

## Modes

- **2 players** – lay the phone flat between you; each player drags on their own half.
- **Vs robot** – drag anywhere to move your (bottom) paddle. Eight robot levels, from Very easy to IMPOSSIBLE.
- **Bot vs bot** – watch two robots play. Tap the court to drop power-ups on them; the 🎲 button on the center line picks which.

Keyboard (desktop): top paddle ← →, bottom paddle A D, P or Esc pauses.

## Install on iPhone / iPad

1. Open the link above in **Safari**.
2. Tap **Share**, then **Add to Home Screen**.
3. Launch Bing Bong from the home screen. It opens full screen, with no browser bars.

## Hosting on GitHub Pages

The repo is a plain static site with no build step. To publish it:

1. Push to `main`.
2. On GitHub, open **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to *Deploy from a branch*, **Branch** to `main` and the folder to `/ (root)`. Save.
4. After a minute the game is live at `https://<your-user>.github.io/<repo-name>/`.

All paths are relative, so the app works from any repo name or sub-path.

## Updating

- Changes to `index.html` reach phones on the next launch with a connection (the service worker fetches the page network-first).
- If you add, rename or change any **other** file the app caches (icons, fonts, manifest), bump `VERSION` in `sw.js` so installed copies re-download them.
- If you change `icon-512.png`, regenerate the launch screens in `splash/` (one per iPhone/iPad screen size, listed in `index.html` between the `<!--SPLASH-->` markers).

## Files

| File | What it is |
| --- | --- |
| `index.html` | The whole game: markup, styles and script |
| `sw.js` | Service worker for offline play |
| `manifest.webmanifest` | App name, colors and icons for installing |
| `apple-touch-icon.png`, `icon-192.png`, `icon-512.png` | App icons |
| `splash/` | iOS launch screens |
| `fonts/` | Bungee and Nunito, self-hosted so the game works offline (SIL Open Font License) |

To run it locally, serve the folder over HTTP (service workers don't run from `file://`):

```bash
python -m http.server 8080
```
