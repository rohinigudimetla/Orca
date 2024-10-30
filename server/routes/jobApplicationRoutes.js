// server/routes/jobApplicationRoutes.js
import express from "express";
import {
	getJobApplications,
	createJobApplication,
	updateJobApplication,
	deleteJobApplication,
} from "../controllers/jobApplicationController.js";

const router = express.Router();

router.get("/", getJobApplications);
router.post("/", createJobApplication);
router.put("/:id", updateJobApplication); // Update job application
router.delete("/:id", deleteJobApplication); // Delete job application

export default router;
