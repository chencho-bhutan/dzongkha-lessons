# Dzongkha Blog — Style Guide & Conventions (v2, full curriculum rebuild)

This replaces the earlier v1 guide. The site was rebuilt from scratch to follow a full curriculum table of contents (source: a structured Dzongkha course document), rather than an ad-hoc lesson sequence.

## Purpose & Audience

A personal blog teaching Dzongkha (national language of Bhutan) to:
- Bhutanese youth who speak some Dzongkha but can't read Ucen script
- Diaspora Bhutanese reconnecting with a language their family speaks
- Curious outsiders with no prior exposure

**Content principles (per user instruction):**
1. Plain language — no technical/linguistic jargon
2. One lesson per chapter/subtopic in the table of contents
3. Each lesson ends with a clear link to the next
4. Keep the flow seamless
5. Enrich with additional knowledge/context where it helps — but flag anything added beyond the user's source material so they can verify it

## Site Structure

- **Home** — intro + latest posts
- **Learn Dzongkha** (`learn.html`) — full table of contents, nested to match the source document's hierarchy (chapter → topic → sub-topic)
- **Culture Notes** — short posts connecting language to Bhutanese life/culture (still empty)
- **About** — personal story, motivation

## The Curriculum (Table of Contents)

Full 42-lesson structure, in order, under `lessons/lesson-01.html` through `lesson-42.html`:

1. Stages of Dzongkha Learning
2–8. Alphabets and Vowels in Dzongkha (Thirty Alphabets, Four Vowels, Compounded Alphabets overview, Three Gochen, Reading Gochen, Three Dogchen, Reading Dogchen)
9–11. How to Construct Words (Identifying the four positional categories, Combining them, Function of Ngonjug)
12–31. Types of Words (Verb, Adverb, Noun, Pronoun, Adjective, then ཕྲད Helping Verbs overview + its 14 sub-types)
32–39. How to Construct Sentences (Classes of Sentences overview + the 7 given cases)
40–41. Tenses of Sentences
42. Combining Sentences to Construct Paragraphs

See `learn.html` for the exact nested presentation — some topics (Compounded Alphabets, Helping Verbs, Classes of Sentences) have their own overview page *plus* separate pages for each sub-type, matching the source document's structure.

## Romanization System — DECIDED

**Use the official Dzongkha Development Commission (DDC) / Roman Dzongkha standard, consistently, from Lesson 2 onward.**

Full consonant table (30 letters):
ka, kha, ga, nga / cha, chha, ja, nya / ta, tha, da, na / pa, pha, ba, ma / tsa, tsha, dza, wa / zha, za, 'a, ya / ra, la, sha, sa / ha, a

Vowels (verified earlier in the project, re-confirmed against the DDC standard):
i (ee), u (oo), e (eh), o (oh)

**Note:** the user's raw source material sometimes uses different spellings (e.g. "gha" instead of "ga", "ngga" instead of "nya", or a different vowel order). Per user decision, always correct silently... no — **flag the discrepancy inline in the lesson** rather than silently overriding, so the user can confirm. Do not ask a fresh clarifying question about romanization again; the standard is settled.

## Open Items / To Verify With User

- **Lesson 6 (Reading Gochen):** the user's source material cuts off mid-sentence describing an exception to the "ra-go" pronunciation rule for base letters other than ཀ/ཏ/ཙ. Flagged inline in the lesson; needs the rest of that rule from the user.
- Audio not yet recorded for any lesson in the Alphabets & Vowels chapter (2–8). Placeholder styling (`.audio-placeholder` CSS class, 🔊 "Coming soon" pill) is in place throughout; swap for real `<audio>` embeds once recordings exist.

## Audio File Naming Convention (for when recording starts)

Format: `[lesson-number]-[item].m4a` (`.m4a`, not `.mp3` — confirmed working from earlier testing). Suggested pattern per new lesson numbering:
- Lesson 2 (Thirty Alphabets): `02-ka.m4a`, `02-kha.m4a`, ... one per letter, or grouped by row
- Lesson 3 (Four Vowels): `03-i.m4a`, `03-u.m4a`, `03-e.m4a`, `03-o.m4a`
- Lesson 5 (Three Gochen) / Lesson 7 (Three Dogchen): one clip per compounded letter or per set

**When uploading new audio to GitHub:** always use "Add file > Upload files" (drag and drop), never paste/edit through the text editor — binary audio files get corrupted if edited as text.

## Site & Hosting

- Live on GitHub Pages, deployed from `main` branch root.
- Static HTML/CSS, one page per lesson under `lessons/`, shared `css/style.css`.
- Design: warm paper background, maroon/saffron/teal palette (Bhutanese textile-inspired), Fraunces (headings) + Work Sans (body) + Jomolhari (Dzongkha script).
- Reusable CSS components now include: `.letter-card` (boxed example with hard shadow + saffron corner accent), `.alphabet-table` (letter/romanization/sound/audio rows), `.audio-placeholder` (dashed pill for unrecorded audio), `.sub-list` / `.sub-sub-list` (nested TOC), `.next-post` (closing link to next lesson).
- New lesson workflow: draft the `.md` first, then build the matching `lessons/lesson-0X.html`, then update the previous lesson's "Next" link, then check `learn.html` already points to the right file (it was pre-generated for all 42 lessons as placeholders, so usually just needs the placeholder file replaced).

## Progress So Far (this rebuild)

| # | Title | Status |
|---|-------|--------|
| 1 | Stages of Dzongkha Learning | ✅ Written, includes SVG stage diagram |
| 2 | The Thirty Alphabets | ✅ Written |
| 3 | The Four Vowels | ✅ Written |
| 4 | Compounded Alphabets (overview) | ✅ Written |
| 5 | The Three Gochen | ✅ Written |
| 6 | How to Read and Pronounce the Gochen | ✅ Written (has flagged gap — see Open Items) |
| 7 | The Three Dogchen | ✅ Written |
| 8 | How to Read and Pronounce the Dogchen | ✅ Written, includes chapter recap checklist |
| 9–42 | — | Placeholder only, awaiting source content from user |

## Next Planned

Lesson 9: **Identifying སྔོན་འཇུག, མིང་གཞི, རྗེས་འཇུག, and ཡང་འཇུག** — first lesson of the "How to Construct Words" chapter. Awaiting source content from user.
