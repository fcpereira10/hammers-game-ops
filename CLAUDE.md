# Hammers Game Ops

Static web app (no build step) served by GitHub Pages from `main` at https://gameops.hammersflagfootball.pt.
Login and data are Firebase (Auth email link / password, Firestore). See README.md.

## How changes go live
- Never push to `main` directly. Every change goes on its own branch and a Pull Request that says what changed, what was tested and whether Firebase needs anything.
- The owner does not want to review on GitHub: once the change is tested, Claude squash-merges the PR itself (REST API) and deletes the branch. Pages then publishes `main`. The PRs are the record of changes.
- Bump `CACHE` in `sw.js` (`hgo-vN`) in every change that touches app files, so installed apps pick up the new version.
- If a change needs new Firestore rules, update `firestore.rules` and say so in the PR: the rules must be pasted in the Firebase console by hand.

## Conventions
- UI text lives in the `L.pt` / `L.en` dictionaries in `app.js`; add every new string in both languages.
- Colors are tokens in `style.css` (`--accent` is Hammers orange #FF3300).
- Motion stays behind `prefers-reduced-motion`.
