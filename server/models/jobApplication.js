// server/models/jobApplication.js
import mongoose from "mongoose";

const jobApplicationSchema = new mongoose.Schema({
	role: { type: String, required: true },
	company: { type: String, required: true },
	status: {
		type: String,
		enum: [
			"submitted",
			"assessment",
			"interviewing",
			"offer received",
			"offer accepted",
		],
		required: true,
	},
	contact: { type: String, required: true },
});

const JobApplication = mongoose.model("JobApplication", jobApplicationSchema);

export default JobApplication;
