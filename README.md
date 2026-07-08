# Career Advisory

A career-suggestion app with student and teacher accounts, backed by a MySQL database.

## Structure

```
Frontend/   Plain HTML, CSS, and JS (no build step, no framework)
Backend/    Express API with MySQL storage and JWT auth
```

## 1. Set up the database

Make sure MySQL is running, then create the schema:

```
mysql -u root -p < Backend/schema.sql
```

This creates a `career_advisory` database with two tables: `users` (students and teachers) and `grades` (each grade submission and its suggested career).

## 2. Configure and start the backend

```
cd Backend
cp .env.example .env
# edit .env with your MySQL password and a random JWT_SECRET
npm install
npm start
```

The API runs on `http://localhost:5000` by default.

## 3. Open the frontend

Open `Frontend/index.html` in a browser (or serve the folder with any static file server). It will send you to the login page if you're not signed in yet.

## How accounts work

- **Register** (`register.html`) creates either a student or a teacher account.
- **Students** log grades and get a recommended career path; every submission is saved and shown in a personal history table.
- **Teachers** see a read-only list of all students and their most recent submission.
- Sessions are stored as a JWT in the browser's local storage and sent as a `Bearer` token on API requests.

## API summary

| Method | Route                          | Access          | Purpose                          |
|--------|--------------------------------|-----------------|-----------------------------------|
| POST   | `/api/auth/register`           | public          | Create a student or teacher account |
| POST   | `/api/auth/login`               | public          | Log in and receive a token        |
| POST   | `/api/career`                    | student         | Submit grades, get a suggestion   |
| GET    | `/api/career/history`            | student         | Your own submission history       |
| GET    | `/api/teacher/students`          | teacher         | All students + latest submission  |
| GET    | `/api/teacher/students/:id/history` | teacher     | One student's full history        |

## Before going live

- Replace the placeholder WhatsApp number in `student.html`.
- Set a strong, random `JWT_SECRET` in `.env` — don't reuse the example.
- The current setup calls `localhost:5000` directly from the frontend; update `API_BASE` in `Frontend/auth.js` if you deploy the API elsewhere.
