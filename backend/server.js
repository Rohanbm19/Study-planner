require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db");

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/ai", require("./routes/ai"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
