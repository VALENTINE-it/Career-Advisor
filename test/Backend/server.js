const express = require("express");
const cors = require("cors");

const careerRoutes = require("./routes/careerRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/career", careerRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});