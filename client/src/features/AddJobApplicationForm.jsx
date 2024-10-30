// client/src/features/AddJobApplicationForm.jsx
import React, { useState } from "react";

const AddJobApplicationForm = ({ onAdd }) => {
	const [formData, setFormData] = useState({
		role: "",
		company: "",
		status: "submitted", // Default status
		contact: "",
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const response = await fetch("http://localhost:5000/api/job-applications", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(formData),
		});

		if (response.ok) {
			const newJobApplication = await response.json();
			onAdd(newJobApplication); // Call the onAdd prop to update the state in JobApplications
			setFormData({ role: "", company: "", status: "submitted", contact: "" }); // Reset the form
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
			<button type="submit">Add Application</button>
		</form>
	);
};

export default AddJobApplicationForm;
