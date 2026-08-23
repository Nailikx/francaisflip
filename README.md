# How2Study (H2S)

Your personal French flashcard app. Flip-card animation, categories, and a
bidirectional mastery system — mastered cards drop out of the rotation so
you keep drilling what you actually don't know yet.

## Run it locally

```bash
npm start
```

Then open http://localhost:3000

No build step, no dependencies — it's plain HTML/CSS/JS served by a tiny
Node server (`server.js`), so it starts instantly and deploys anywhere that
runs Node.

## How studying works

- Each card quizzes you in **one of two directions**, picked automatically:
  - **FR → EN/DE**: you see the French, flip to check the English/German.
  - **EN/DE → FR**: you see the English or German word, flip to check the French.
- Tap/click the card (or press **Space**) to flip.
- **✅ I knew it** (or **→**) — counts toward mastery.
- **❌ Didn't know** (or **←**) — resets that card's streak to 0 and puts it
  back in the rotation a few cards later (the direction-achieved checkmarks
  below the card are *not* lost on a wrong answer, only the streak is).
- A card is sent to **Mastered** (with a confetti pop) once you've gotten
  it right **3 times total, including at least once in each direction** —
  getting it right 3 times the same way isn't enough.
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
- `en` — English translation (**required**)
- `de` — German translation (**required** — every card needs both so it can
  quiz in either direction)
- `cat` — category name (used for the filter chips; reuse an existing one or make a new one)
- `emoji` — optional, shown next to the French text

Just add a new object to the `DECK` array and refresh the page — no build
step required.

**Before turning notes into cards:** always read through the raw notes
first and make sense of them — a lot of the French is written phonetically
(how it sounded, not how it's spelled), so it needs to be interpreted, not
transcribed literally. Only fix things that are actually wrong; don't
"correct" a translation just because a different phrasing is more textbook —
if the notes came from a specific class, that's the version being tested on.

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
