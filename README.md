# Career Advisor

A simple career-advisor website:

- Registration & login (SQLite + bcrypt + sessions)
- Landing page where a logged-in student enters their **overall grade (A / B / C / D / E)** and gets career suggestions
- Rule-based (non-AI) chatbot with predefined prompts to talk to a "career advisor"

## Stack

- **Frontend:** plain HTML, CSS, vanilla JS
- **Backend:** Node.js + Express
- **Database:** SQLite (via `better-sqlite3`) — auto-created as `data.db` on first run

## Run locally

```bash
npm install
npm start
or
node server.js
```

Then open http://localhost:3000

## Grade → Career mapping (defaults)

| Grade | Suggested careers |
|-------|-------------------|
| A     | Medicine, Engineering, Actuarial Science, Law, Architecture |
| B     | Computer Science, Nursing, Pharmacy, Economics, Education (STEM) |
| C     | IT, Business Administration, Journalism, Teaching, Accounting |
| D     | Hospitality, Sales & Marketing, Social Work, Community Development |
| E     | Technical & Vocational trades (plumbing, electrical, tailoring, culinary arts) |

Edit `careerRules` in `server.js` to change these.

## Chatbot

The chatbot is **not AI** — it matches the student's message against keywords
(`career`, `university`, `grade`, `stress`, etc.) defined in `botRules` inside
`public/js/chat.js` and returns a scripted advisor reply.
