import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./db.js";
import passport from "passport";
import "./passport.js";

// Routes
import authRoutes from "./routes/auth.js";
import queryRoutes from "./routes/query.js";
import roadmapRoutes from "./routes/roadmap.js";
import dashboardRoutes from "./routes/dashboard.js";
import ocrRoutes from "./routes/ocr.js";
import flashcardRoutes from "./routes/flashcard.js";
import quizRoutes from "./routes/quiz.js";
import gamificationRoutes from "./routes/gamification.js";

// Middleware
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(passport.initialize());
connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/query", queryRoutes);
app.use("/api/roadmap", roadmapRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/ocr", ocrRoutes);
app.use("/api/flashcard", flashcardRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/gamification", gamificationRoutes);
app.use(errorHandler);

// Debug: DB and collection counts
app.get("/api/debug/db", async (req, res) => {
  try {
    const mongoose = (await import("mongoose")).default;
    const conn = mongoose.connection;
    const dbName = conn.name;
    const collections = await conn.db.listCollections().toArray();
    const counts = {};
    for (const c of collections) {
      counts[c.name] = await conn.db.collection(c.name).countDocuments();
    }
    res.json({ dbName, host: conn.host, port: conn.port, collections: counts });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

app.get("/", (req, res) => {
  res.send("Skill Sculptor Backend is running 🚀");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
