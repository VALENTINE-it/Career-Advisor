const express = require("express");
const router = express.Router();

const { getStudents, getStudentHistory } = require("../controllers/teacherController");
const { verifyToken, requireRole } = require("../middleware/authMiddleware");

router.get("/students", verifyToken, requireRole("teacher"), getStudents);
router.get("/students/:id/history", verifyToken, requireRole("teacher"), getStudentHistory);

module.exports = router;
