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

// Update an existing job application
export const updateJobApplication = async (req, res) => {
	try {
		const { id } = req.params;
		const updatedJobApplication = await JobApplication.findByIdAndUpdate(
			id,
			req.body,
			{ new: true }
		);
		if (!updatedJobApplication)
			return res.status(404).json({ message: "Job application not found" });
		res.status(200).json(updatedJobApplication);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

// Delete a job application
export const deleteJobApplication = async (req, res) => {
	try {
		const { id } = req.params;
		const deletedJobApplication = await JobApplication.findByIdAndDelete(id);
		if (!deletedJobApplication)
			return res.status(404).json({ message: "Job application not found" });
		res.status(204).send(); // No content response
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};
