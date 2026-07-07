const { suggestCareer } = require("../utils/logic");

exports.getCareer = (req, res) => {
  const { math, english, science } = req.body;

  const career = suggestCareer(math, english, science);

  res.json({ career });
};