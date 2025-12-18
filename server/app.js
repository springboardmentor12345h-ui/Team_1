import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "./config/db.js";

import authRoutes from "./routes/auth.js";
import eventRoutes from "./routes/eventRoutes.js";
import registrationRoutes from "./routes/registrationRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Database
connectDB();

// Routes
app.use("/auth", authRoutes);
app.use("/events", eventRoutes);
app.use("/registrations", registrationRoutes);
app.use("/api/feedback", feedbackRoutes);

// Server
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});