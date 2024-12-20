// server/index.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import jobApplicationRoutes from "./routes/jobApplicationRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { auth } from "./middleware/auth.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose
	.connect("mongodb://localhost:27017/jobapp", {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log("Connected to MongoDB");
	})
	.catch((err) => {
		console.error("Failed to connect to MongoDB", err);
	});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/job-applications", auth, jobApplicationRoutes);

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
