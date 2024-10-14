// server/controllers/jobApplicationController.js
import JobApplication from "../models/jobApplication.js";

// Get all job applications
export const getJobApplications = async (req, res) => {
	try {
		const jobApplications = await JobApplication.find();
		res.status(200).json(jobApplications);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Create a new job application
export const createJobApplication = async (req, res) => {
	const newJobApplication = new JobApplication(req.body);

	try {
		await newJobApplication.save();
		res.status(201).json(newJobApplication);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};
