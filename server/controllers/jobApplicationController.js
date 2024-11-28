// server/controllers/jobApplicationController.js
import { readFileSync, createReadStream, unlinkSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pdfParser from "pdf-parser";
import JobApplication from "../models/jobApplication.js";
import { exec } from "child_process";
import { promisify } from "util";
import fetch from "node-fetch";
import FormData from "form-data";
import { generateModifiedResume } from "../services/openaiService.js";
const execAsync = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Update the text extraction function to use callback style
const extractTextFromPdf = async (filePath) => {
	try {
		console.log("Extracting text from:", filePath);
		const formData = new FormData();
		const fileBuffer = readFileSync(filePath);
		formData.append("file", fileBuffer, {
			filename: path.basename(filePath),
			contentType: "application/pdf",
		});

		let response;
		try {
			response = await fetch("http://localhost:5001/extract", {
				method: "POST",
				body: formData,
			});
		} catch (error) {
			if (error.code === "ECONNREFUSED") {
				throw new Error(
					"PDF extraction service is not running. Please start the Python service."
				);
			}
			throw error;
		}

		if (!response.ok) {
			throw new Error("PDF extraction failed");
		}

		const data = await response.json();
		if (data.error) {
			throw new Error(data.error);
		}

		return data.text;
	} catch (error) {
		console.error("PDF extraction error:", error);
		throw error;
	}
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
				unlinkSync(req.file.path); // Clean up uploaded file if validation fails
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

		if (!jobApplication) {
			return res.status(404).json({ message: "Job application not found" });
		}

		if (!req.file) {
			return res.status(400).json({ message: "No file uploaded" });
		}

		// Extract text from the PDF
		const extractedText = await extractTextFromPdf(req.file.path);

		// Save the file path and extracted text
		jobApplication.resume = req.file.path;
		jobApplication.resumeText = extractedText;
		await jobApplication.save();

		res.status(200).json(jobApplication);
	} catch (error) {
		console.error("Upload error:", error);
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
		unlinkSync(path.resolve(jobApplication.resume));

		// Reset both resume and resumeText fields
		jobApplication.resume = null;
		jobApplication.resumeText = null;

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
		const { prompt } = req.body;

		const application = await JobApplication.findById(id);

		if (!application) {
			return res.status(404).json({ message: "Job application not found" });
		}

		if (!application.jobDescription || !application.resumeText) {
			return res.status(400).json({
				message: "Both job description and resume text are required",
			});
		}

		const modifiedResume = await generateModifiedResume(
			application.resumeText,
			application.jobDescription,
			prompt
		);

		res.status(200).json({
			modifiedResume,
			message: "Resume generated successfully",
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
