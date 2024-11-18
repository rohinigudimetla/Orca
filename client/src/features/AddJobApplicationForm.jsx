import React, { useState } from "react";

const AddJobApplicationForm = ({ onAdd }) => {
	const [formData, setFormData] = useState({
		role: "",
		company: "",
		status: "submitted", // Default status
		contact: "",
		resume: null, // File field
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleFileChange = (e) => {
		// Handle file input separately
		setFormData({ ...formData, resume: e.target.files[0] });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const submissionData = new FormData();
		submissionData.append("role", formData.role);
		submissionData.append("company", formData.company);
		submissionData.append("status", formData.status);
		submissionData.append("contact", formData.contact);
		if (formData.resume) {
			submissionData.append("resume", formData.resume);
		}

		// Log the FormData keys and values
		for (let [key, value] of submissionData.entries()) {
			console.log(`${key}: ${value}`);
		}

		const response = await fetch("http://localhost:5000/api/job-applications", {
			method: "POST",
			body: submissionData,
		});

		if (response.ok) {
			const newJobApplication = await response.json();
			onAdd(newJobApplication);
			setFormData({
				role: "",
				company: "",
				status: "submitted",
				contact: "",
				resume: null,
			});
		} else {
			console.error("Failed to add job application");
		}
	};

	return (
		<form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
			<h2>Add Job Application</h2>
			<input
				type="text"
				name="role"
				placeholder="Role"
				value={formData.role}
				onChange={handleChange}
				required
			/>
			<input
				type="text"
				name="company"
				placeholder="Company"
				value={formData.company}
				onChange={handleChange}
				required
			/>
			<select name="status" value={formData.status} onChange={handleChange}>
				<option value="submitted">Submitted</option>
				<option value="assessment">Assessment</option>
				<option value="interviewing">Interviewing</option>
				<option value="offer received">Offer Received</option>
				<option value="offer accepted">Offer Accepted</option>
			</select>
			<input
				type="text"
				name="contact"
				placeholder="Contact"
				value={formData.contact}
				onChange={handleChange}
				required
			/>
			{/* Add file input for the resume */}
			<input
				type="file"
				name="resume"
				accept="application/pdf"
				onChange={handleFileChange}
			/>
			<button type="submit">Add Application</button>
		</form>
	);
};

export default AddJobApplicationForm;
