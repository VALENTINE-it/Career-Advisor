const express = require("express");
const router = express.Router();

const { getCareer, getMyHistory } = require("../controllers/careerController");
const { verifyToken, requireRole } = require("../middleware/authMiddleware");

router.post("/", verifyToken, requireRole("student"), getCareer);
router.get("/history", verifyToken, requireRole("student"), getMyHistory);

module.exports = router;
