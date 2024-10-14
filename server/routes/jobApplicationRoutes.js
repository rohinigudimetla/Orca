// server/routes/jobApplicationRoutes.js
import express from "express";
import {
	getJobApplications,
	createJobApplication,
} from "../controllers/jobApplicationController.js";

const router = express.Router();

router.get("/", getJobApplications);
router.post("/", createJobApplication);

export default router;
