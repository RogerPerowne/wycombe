# Quiz System - Architecture & How to Add a New Topic

## File structure

There are now **5 files** that power the entire quiz system:

| File | Purpose | Edit when... |
|---|---|---|
| `quiz-engine.js`     | Renders all 12 question formats. The "engine".  | Almost never |
| `quiz-styles.css`    | Styling for everything inside a quiz.            | Almost never |
| `quiz-data.js`       | All topic content - **single source of truth**. | Adding/editing topics |
| `quiz.html`          | Universal runner. Reads `?topic=XYZ` from URL.   | Almost never |
| `micro-quiz.html`    | Hub for Paper 1 (auto-builds from data).         | Almost never |
| `macro-quiz.html`    | Hub for Paper 2 (auto-builds from data).         | Almost never |

Old per-topic files (`demand-quiz.html`, `supply-quiz.html` etc.) can now be deleted - the new `quiz.html?topic=demand` URLs replace them.

---

## How a quiz loads (the flow)

1. Pupil clicks a topic card on `micro-quiz.html` -> goes to `quiz.html?topic=demand`
2. `quiz.html` reads `topic=demand` from the URL
3. Looks up `QUIZZES.demand` in `quiz-data.js`
4. Calls `bootQuiz(...)` with that data
5. Engine renders the questions

To add a new topic, you only ever touch **one file**: `quiz-data.js`.

---

## How to add a new topic (3 steps)

### Step 1 - Confirm the topic id

Open `quiz-data.js` and check the `THEMES` object. The topic id is in there already - for instance, `monopoly`, `inflation_meas`, `exchange_rates`. Use that exact id.

### Step 2 - Add an entry to `QUIZZES`

Inside the `QUIZZES` object, add a new key with the topic id:

```javascript
"monopoly": {
  paper: 'micro',                                       // 'micro' or 'macro'
  title: 'Monopoly',                                    // shown in the header
  subtitle: 'A-Level &middot; Edexcel Paper 1 &middot; Theme 3',
  badge: 'Paper 1 &middot; T3',                         // pill in header right
  questions: [
    { type:'mcq',
      stem:'...',
      opts:[ '...', '...', '...', '...' ],
      ans:0,
      exp:'...' },
    // ... 9 more questions
  ]
},
```

That's it. The hub auto-detects the new entry, the topic flips from "Coming Soon" to "Available", and the link works immediately.

### Step 3 - Save and refresh

No new HTML file. No build step. Just save `quiz-data.js`.

---

## The 12 question formats available

All formats render automatically based on the `type` field. See existing topics for working examples of each.

| `type`             | Use for                                                       |
|--------------------|----------------------------------------------------------------|
| `mcq`              | Standard 4-option multiple choice                              |
| `confidence_mcq`   | MCQ with reflective tone ("a junior analyst objects...")       |
| `multi_select`     | Tick all that apply                                            |
| `elastic_sort`     | Drag-and-tap two-column sort (e.g. shift vs movement)          |
| `odd_one_out`      | Three of these are the same - which is different?              |
| `rank`             | Tap items in order (most to least, first to last)              |
| `chain`            | Logical/causal sequencing (cause -> effect)                    |
| `calculation`      | Maths question with worked solution panel                      |
| `data_table`       | Question stem driven by a data table                           |
| `diagram_interp`   | SVG diagram with multiple-choice question about it             |
| `para_fill`        | Fill-the-blank analytical paragraph                            |
| `diagnostic_pair`  | Compare two student answers - which is the stronger one?       |

---

## Optional: shared SVG diagrams

If a question uses a custom SVG diagram, you can either:

- **Inline the SVG** in the question's `svg:` field (one-off use), or
- **Add it to the `DIAGRAMS` object** at the top of `quiz-data.js` (for reuse), then reference it as `svg: DIAGRAMS.myDiagram`.

The DIAGRAMS object is just a place to keep large SVG strings out of the question array.

---

## When "Coming Soon" topics become available

The hub pages count and display:
> "Theme 1: 16 topics &middot; 7 available"

This number updates automatically as you add new entries to `QUIZZES`. There is no separate list to maintain.

---

## Site links (unchanged)

- `index.html` -> `micro-quiz.html`  (Paper 1 hub)
- `index.html` -> `macro-quiz.html`  (Paper 2 hub)
- Old `demand-quiz.html` etc. links from anywhere still in your site can be replaced with `quiz.html?topic=demand`.

If anything else on the site links to the old per-topic files, it can either be updated to the new URL or kept working by leaving the old files in place during transition.
