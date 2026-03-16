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
  res.send("School API is running ??");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
