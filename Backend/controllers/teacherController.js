const pool = require("../config/db");

// Every student, with their most recent submission (if any).
exports.getStudents = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT u.id, u.name, u.email,
              g.math, g.english, g.science, g.career_suggestion, g.created_at
       FROM users u
       LEFT JOIN grades g ON g.id = (
         SELECT id FROM grades WHERE student_id = u.id
         ORDER BY created_at DESC LIMIT 1
       )
       WHERE u.role = 'student'
       ORDER BY u.name ASC`
    );
    res.json({ students: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not load students" });
  }
};

// Full submission history for one student.
exports.getStudentHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      "SELECT math, english, science, career_suggestion, created_at FROM grades WHERE student_id = ? ORDER BY created_at DESC",
      [id]
    );
    res.json({ history: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not load student history" });
  }
};
