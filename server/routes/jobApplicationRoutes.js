// server/routes/jobApplicationRoutes.js
import express from "express";
import {
	getJobApplications,
	createJobApplication,
	updateJobApplication,
	deleteJobApplication,
	uploadResume,
	downloadResume,
	deleteResume,
} from "../controllers/jobApplicationController.js";
import upload from "../middleware/upload.js"; // <-- Import upload middleware

const router = express.Router();

router.get("/", getJobApplications);
router.post("/", createJobApplication);
router.put("/:id", updateJobApplication);
router.delete("/:id", deleteJobApplication);

// New routes for handling resume upload/download/delete
router.post("/:id/upload-resume", upload.single("resume"), uploadResume);
router.get("/:id/download-resume", downloadResume);
router.delete("/:id/delete-resume", deleteResume);

export default router;
