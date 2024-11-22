import React, { useState } from "react";

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

		// Add each field to FormData
		Object.keys(formData).forEach((key) => {
			if (formData[key]) {
				if (key === "resume") {
					submissionData.append("resume", formData[key]);
				} else {
					submissionData.append(key, formData[key]);
				}
			}
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
			} else {
				const errorData = await response.json();
				console.error("Server error:", errorData);
				alert(errorData.message || "Failed to create job application");
			}
		} catch (error) {
			console.error("Failed to add job application:", error);
			alert("Failed to create job application. Please try again.");
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="grid grid-cols-6 bg-gray-50 border-t-2 border-gray-200 border-dashed hover:bg-white transition-colors"
		>
			<div className="p-3">
				<input
					type="text"
					name="role"
					placeholder="Role"
					value={formData.role}
					onChange={handleChange}
					required
					className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent"
				/>
			</div>
			<div className="p-3">
				<input
					type="text"
					name="company"
					placeholder="Company"
					value={formData.company}
					onChange={handleChange}
					required
					className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent"
				/>
			</div>
			<div className="p-3">
				<select
					name="status"
					value={formData.status}
					onChange={handleChange}
					className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent"
				>
					<option value="submitted">Submitted</option>
					<option value="assessment">Assessment</option>
					<option value="interviewing">Interviewing</option>
					<option value="offer received">Offer Received</option>
					<option value="offer accepted">Offer Accepted</option>
					<option value="offer rejected">Offer Rejected</option>
					<option value="hired">Hired</option>
					<option value="rejected">Rejected</option>
				</select>
			</div>
			<div className="p-3">
				<input
					type="text"
					name="contact"
					placeholder="Contact"
					value={formData.contact}
					onChange={handleChange}
					required
					className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent"
				/>
			</div>
			<div className="p-3">
				<input
					type="file"
					name="resume"
					onChange={handleFileChange}
					required
					className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent"
				/>
			</div>
			<div className="p-3">
				<button
					type="submit"
					className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
				>
					Add
				</button>
			</div>
		</form>
	);
};

export default AddJobApplicationForm;
