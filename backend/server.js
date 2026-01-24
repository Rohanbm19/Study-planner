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

app.listen(5000, () => console.log("Server running on 5000"));
