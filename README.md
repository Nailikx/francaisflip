# FrançaisFlip 🇫🇷

Your personal French flashcard app. Flip-card animation, categories, and a
"get it right 3 times to master it" system — mastered cards drop out of the
rotation so you keep drilling what you actually don't know yet.

## Run it locally

```bash
npm start
```

Then open http://localhost:3000

No build step, no dependencies — it's plain HTML/CSS/JS served by a tiny
Node server (`server.js`), so it starts instantly and deploys anywhere that
runs Node.

## How studying works

- Tap/click the card (or press **Space**) to flip between French and the
  English/German translation.
- **✅ I knew it** (or **→**) — counts toward mastery. 3 correct answers
  (not necessarily in a row across sessions, but you need 3 total without it
  resetting) sends the card to the **Mastered** tab with a confetti pop.
- **❌ Didn't know** (or **←**) — resets that card's streak to 0 and puts it
  back in the rotation a few cards later.
- Progress is saved per-card in your browser's `localStorage`, so it
  persists between visits on the same device/browser.
- Use the category chips to drill one topic at a time (Weather, School
  Supplies, Verb Tables, etc.), or "Reset progress" on the Mastered tab to
  start over.

## Editing / adding cards

All flashcards live in one place: [`public/cards.js`](public/cards.js).
Each entry looks like:

```js
{ fr: "Il neige", en: "It's snowing", de: "Es schneit", cat: "Weather" },
```

- `fr` — French (front of card)
- `en` — English (back of card, required)
- `de` — German (back of card, optional — omit the field if there's no German note)
- `cat` — category name (used for the filter chips; reuse an existing one or make a new one)
- `emoji` — optional, shown next to the French text

Just add a new object to the `DECK` array and refresh the page — no build
step required.

## Deploying

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
gh repo create francaisflip --private --source=. --push
```

(If you don't have the `gh` CLI, create an empty repo on github.com instead,
then `git remote add origin <url>` and `git push -u origin main`.)

### 2. Deploy on Railway

1. Go to [railway.app](https://railway.app) and **New Project → Deploy from
   GitHub repo**, pick `francaisflip`.
2. Railway auto-detects Node (via `package.json`) and runs `npm start`. No
   extra config needed — it reads `process.env.PORT` automatically.
3. Once deployed, Railway gives you a public URL — open it on your phone and
   study anywhere.

Every time you `git push`, Railway redeploys automatically.
