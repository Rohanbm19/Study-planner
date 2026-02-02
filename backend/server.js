// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db.js";

import authRoutes from "./routes/auth.js";
// ❌ DO NOT IMPORT AI OR CHAT ROUTES

dotenv.config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

// ✅ ONLY AUTH ROUTES
app.use("/api/auth", authRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
