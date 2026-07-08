const { suggestCareer } = require("../utils/logic");
const pool = require("../config/db");

exports.getCareer = async (req, res) => {
  try {
    const { math, english, science } = req.body;

    if ([math, english, science].some((g) => g === undefined || g === null || g === "")) {
      return res.status(400).json({ error: "Math, English, and Science grades are required" });
    }

    const career = suggestCareer(math, english, science);

    await pool.query(
      "INSERT INTO grades (student_id, math, english, science, career_suggestion) VALUES (?, ?, ?, ?, ?)",
      [req.user.id, math, english, science, career]
    );

    res.json({ career });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not calculate a career suggestion" });
  }
};

exports.getMyHistory = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT math, english, science, career_suggestion, created_at FROM grades WHERE student_id = ? ORDER BY created_at DESC",
      [req.user.id]
    );
    res.json({ history: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not load your history" });
  }
};
