const express = require("express");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

const app = express();
const dataPath = path.join(__dirname, "data.json");

function loadData() {
  if (!fs.existsSync(dataPath)) {
    return { users: [], adviceHistory: [] };
  }
  try {
    return JSON.parse(fs.readFileSync(dataPath, "utf-8"));
  } catch (error) {
    console.error("Failed to read data file:", error);
    return { users: [], adviceHistory: [] };
  }
}

function saveData(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

const jsonData = loadData();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "change-me-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 },
  })
);

// ---------- Career rules ----------
const careerRules = {
  A: {
    title: "Excellent — top-tier options",
    careers: ["Medicine", "Engineering", "Actuarial Science", "Law", "Architecture"],
    message:
      "Your grade opens doors to the most competitive university programs. Focus on your strongest subjects and consider scholarships.",
  },
  B: {
    title: "Very good — strong professional tracks",
    careers: ["Computer Science", "Nursing", "Pharmacy", "Economics", "Education (STEM)"],
    message:
      "You qualify for most degree programs. Pick a field that matches your favorite subjects and long-term interests.",
  },
  C: {
    title: "Good — solid diploma & degree options",
    careers: ["IT", "Business Administration", "Journalism", "Teaching", "Accounting"],
    message:
      "You have great options in both universities and colleges. Practical, skills-based programs are a strong match.",
  },
  D: {
    title: "Fair — diploma & certificate paths",
    careers: ["Hospitality Management", "Sales & Marketing", "Social Work", "Community Development"],
    message:
      "Consider diploma and certificate courses. Build experience early — many of these fields reward soft skills and hustle.",
  },
  E: {
    title: "Vocational & technical strengths",
    careers: ["Plumbing", "Electrical Installation", "Tailoring & Fashion", "Culinary Arts", "Auto Mechanics"],
    message:
      "Technical & vocational training (TVET) can lead to fast employment and self-employment. Skilled trades are in high demand.",
  },
};

// ---------- Auth helpers ----------
function requireAuth(req, res, next) {
  if (!req.session.userId) return res.status(401).json({ error: "Not logged in" });
  next();
}

// ---------- Routes ----------
app.post("/api/register", (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: "All fields are required" });
  if (password.length < 6)
    return res.status(400).json({ error: "Password must be at least 6 characters" });

  const normalizedEmail = String(email).trim().toLowerCase();
  if (jsonData.users.some((u) => u.email === normalizedEmail)) {
    return res.status(400).json({ error: "Email already registered" });
  }

  const hash = bcrypt.hashSync(password, 10);
  const user = {
    id: jsonData.users.length ? Math.max(...jsonData.users.map((u) => u.id)) + 1 : 1,
    name: name.trim(),
    email: normalizedEmail,
    password: hash,
    created_at: new Date().toISOString(),
  };

  jsonData.users.push(user);
  saveData(jsonData);

  req.session.userId = user.id;
  req.session.userName = user.name;
  res.json({ ok: true, name: user.name });
});

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email and password required" });

  const normalizedEmail = String(email).trim().toLowerCase();
  const user = jsonData.users.find((u) => u.email === normalizedEmail);
  if (!user || !bcrypt.compareSync(password, user.password))
    return res.status(401).json({ error: "Invalid email or password" });

  req.session.userId = user.id;
  req.session.userName = user.name;
  res.json({ ok: true, name: user.name });
});

app.post("/api/logout", (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

app.get("/api/me", (req, res) => {
  if (!req.session.userId) return res.json({ user: null });
  res.json({ user: { id: req.session.userId, name: req.session.userName } });
});

app.post("/api/advise", requireAuth, (req, res) => {
  const grade = String(req.body.grade || "").trim().toUpperCase();
  const rule = careerRules[grade];
  if (!rule)
    return res.status(400).json({ error: "Please enter a valid grade: A, B, C, D or E" });
  const suggestion = `${rule.title}: ${rule.careers.join(", ")}`;
  jsonData.adviceHistory.push({
    id: jsonData.adviceHistory.length
      ? Math.max(...jsonData.adviceHistory.map((row) => row.id)) + 1
      : 1,
    user_id: req.session.userId,
    grade,
    suggestion,
    created_at: new Date().toISOString(),
  });
  saveData(jsonData);
  res.json({ grade, ...rule });
});

app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Career Advisor running on http://localhost:${PORT}`));
