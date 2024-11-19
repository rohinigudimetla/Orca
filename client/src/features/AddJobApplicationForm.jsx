import React, { useState } from "react";
import "./AddJobApplicationForm.css";

const AddJobApplicationForm = ({ onAdd }) => {
	const [formData, setFormData] = useState({
		role: "",
		company: "",
		status: "submitted",
		contact: "",
		resume: null,
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleFileChange = (e) => {
		setFormData({ ...formData, resume: e.target.files[0] });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const submissionData = new FormData();
		Object.keys(formData).forEach((key) => {
			if (formData[key]) submissionData.append(key, formData[key]);
		});

		try {
			const response = await fetch(
				"http://localhost:5000/api/job-applications",
				{
					method: "POST",
					body: submissionData,
				}
			);

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
			}
		} catch (error) {
			console.error("Failed to add job application:", error);
		}
	};

	return (
		<div className="application-row new-application">
			<div className="cell">
				<input
					type="text"
					name="role"
					placeholder="Role"
					value={formData.role}
					onChange={handleChange}
					required
				/>
			</div>
			<div className="cell">
				<input
					type="text"
					name="company"
					placeholder="Company"
					value={formData.company}
					onChange={handleChange}
					required
				/>
			</div>
			<div className="cell">
				<select name="status" value={formData.status} onChange={handleChange}>
					<option value="submitted">Submitted</option>
					<option value="assessment">Assessment</option>
					<option value="interviewing">Interviewing</option>
					<option value="offer received">Offer Received</option>
					<option value="offer accepted">Offer Accepted</option>
				</select>
			</div>
			<div className="cell">
				<input
					type="text"
					name="contact"
					placeholder="Contact"
					value={formData.contact}
					onChange={handleChange}
					required
				/>
			</div>
			<div className="cell resume-cell">
				<div className="resume-actions">
					<div className="upload-container">
						<input
							type="file"
							id="new-resume-upload"
							name="resume"
							accept=".pdf"
							onChange={handleFileChange}
							style={{ display: "none" }}
						/>
						<label htmlFor="new-resume-upload" className="upload-btn">
							Upload Resume
						</label>
					</div>
				</div>
			</div>
			<div className="cell actions-cell">
				<button type="submit" className="add-btn" onClick={handleSubmit}>
					Add
				</button>
			</div>
		</div>
	);
};

export default AddJobApplicationForm;
