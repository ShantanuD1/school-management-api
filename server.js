const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const schoolRoutes = require("./routes/schoolRoutes");

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.use("/", schoolRoutes);
app.get("/", (req, res) => {
  res.send("School API is running 🚀");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
