const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./db");

const app = express();

connectDB(); // ✅ MUST BE HERE BEFORE ROUTES

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/ai", require("./routes/ai"));

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
