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
	try {
		const { role, company, status, contact } = req.body;

		// Validate required fields
		if (!role || !company || !status || !contact) {
			return res.status(400).json({ message: "All fields are required" });
		}

		console.log("Request Body:", req.body); // Logs text fields
		console.log("Uploaded File:", req.file); // Logs file details

		const newJobApplication = new JobApplication({
			role,
			company,
			status,
			contact,
			resume: req.file ? req.file.path : null, // Save file path if a file is uploaded
		});

		await newJobApplication.save();
		res.status(201).json(newJobApplication);
	} catch (error) {
		console.error("Error creating job application:", error);
		res.status(500).json({ message: error.message });
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

// Upload Resume
export const uploadResume = async (req, res) => {
	try {
		const { id } = req.params;
		const jobApplication = await JobApplication.findById(id);
		if (!jobApplication)
			return res.status(404).json({ message: "Job application not found" });

		// Save resume file path to the database
		jobApplication.resume = req.file.path;
		await jobApplication.save();
		res.status(200).json(jobApplication);
		console.log("Uploaded file:", req.file); // Check multer behavior
		console.log("Updated job application:", jobApplication); // Confirm database update
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

// Download Resume
export const downloadResume = async (req, res) => {
	try {
		const { id } = req.params;
		const jobApplication = await JobApplication.findById(id);
		if (!jobApplication || !jobApplication.resume)
			return res.status(404).json({ message: "Resume not found" });

		res.download(path.resolve(jobApplication.resume));
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

// Delete Resume
export const deleteResume = async (req, res) => {
	try {
		const { id } = req.params;
		const jobApplication = await JobApplication.findById(id);
		if (!jobApplication || !jobApplication.resume)
			return res.status(404).json({ message: "Resume not found" });

		// Delete the resume file
		fs.unlinkSync(path.resolve(jobApplication.resume));
		jobApplication.resume = null; // Reset the resume field
		await jobApplication.save();
		res.status(200).json(jobApplication);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};
