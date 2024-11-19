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
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/", getJobApplications);
router.post("/", upload.single("resume"), createJobApplication);
router.put("/:id", updateJobApplication);
router.delete("/:id", deleteJobApplication);

// Resume-specific routes
router.post("/:id/upload-resume", upload.single("resume"), uploadResume);
router.get("/:id/download-resume", downloadResume);
router.delete("/:id/delete-resume", deleteResume);

export default router;
