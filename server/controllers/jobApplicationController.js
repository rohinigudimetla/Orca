// server/controllers/jobApplicationController.js
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pdfParser from "pdf-parser";
import JobApplication from "../models/jobApplication.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Update the text extraction function to use callback style
const extractTextFromPdf = (filePath) => {
	return new Promise((resolve, reject) => {
		pdfParser.pdf2text(filePath, (error, text) => {
			if (error) {
				console.error("PDF parsing error:", error);
				reject(new Error("Failed to parse PDF file"));
			} else {
				resolve(text);
			}
		});
	});
};

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
		console.log("Received request body:", req.body);
		console.log("Received file:", req.file);

		const { role, company, status, contact } = req.body;

		// Validate required fields
		if (!role || !company || !status || !contact) {
			if (req.file) {
				fs.unlinkSync(req.file.path); // Clean up uploaded file if validation fails
			}
			return res.status(400).json({
				message: "All fields are required",
				received: { role, company, status, contact },
			});
		}

		// Extract text from PDF if file exists
		let resumeText = "";
		if (req.file) {
			try {
				resumeText = await extractTextFromPdf(req.file.path);
			} catch (error) {
				console.error("PDF parsing error:", error);
			}
		}

		const newJobApplication = new JobApplication({
			role,
			company,
			status,
			contact,
			resume: req.file ? req.file.path : null,
			resumeText: resumeText || null,
		});

		const savedApplication = await newJobApplication.save();
		console.log("Saved application:", savedApplication);
		res.status(201).json(savedApplication);
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

		// Extract text from PDF
		let resumeText = "";
		if (req.file) {
			try {
				resumeText = await extractTextFromPdf(req.file.path);
			} catch (error) {
				return res.status(400).json({ message: error.message });
			}
		}

		// Save resume file path and text to the database
		jobApplication.resume = req.file.path;
		jobApplication.resumeText = resumeText;
		await jobApplication.save();

		console.log("Uploaded file:", req.file);
		console.log("Updated job application:", jobApplication);
		res.status(200).json(jobApplication);
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

// Add this new controller function
export const generateResume = async (req, res) => {
	try {
		const { id } = req.params;
		const { matchPercentage } = req.body;

		const application = await JobApplication.findById(id);

		if (!application) {
			return res.status(404).json({ message: "Job application not found" });
		}

		if (!application.jobDescription) {
			return res.status(400).json({
				message: "Job description is required to generate a resume",
				requiredField: "jobDescription",
			});
		}

		if (!application.resumeText) {
			return res.status(400).json({
				message: "Resume text is required to generate a new resume",
				requiredField: "resumeText",
			});
		}

		// TODO: Add AI integration here
		// For now, return a mock response
		res.status(200).json({
			message: "Resume generation initiated",
			status: "pending",
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
