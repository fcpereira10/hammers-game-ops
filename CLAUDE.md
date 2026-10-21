# Hammers Game Ops

Static web app (no build step) served by GitHub Pages from `main` at https://gameops.hammersflagfootball.pt.
Login and data are Firebase (Auth email link / password, Firestore). See README.md.

## How changes go live
- Never push to `main` directly. Every change goes on its own branch and a Pull Request; the owner merges it, and Pages publishes `main`.
- Bump `CACHE` in `sw.js` (`hgo-vN`) in every change that touches app files, so installed apps pick up the new version.
- If a change needs new Firestore rules, update `firestore.rules` and say so in the PR: the rules must be pasted in the Firebase console by hand.

## Conventions
- UI text lives in the `L.pt` / `L.en` dictionaries in `app.js`; add every new string in both languages.
- Colors are tokens in `style.css` (`--accent` is Hammers orange #FF3300).
- Motion stays behind `prefers-reduced-motion`.
