const express = require("express");
const router = express.Router();

const { getCareer } = require("../controllers/careerController");

router.post("/", getCareer);

module.exports = router;