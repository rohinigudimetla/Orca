// client/src/components/JobApplicationCard.jsx
import React, { useState } from "react";

const JobApplicationCard = ({ job, onDelete, onUpdate }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [editingData, setEditingData] = useState({ ...job });

	const handleEditChange = (e) => {
		const { name, value } = e.target;
		setEditingData({ ...editingData, [name]: value });
	};

	const handleSaveEdit = async () => {
		const response = await fetch(
			`http://localhost:5000/api/job-applications/${editingData._id}`,
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(editingData),
			}
		);

		if (response.ok) {
			const updatedJobApplication = await response.json();
			onUpdate(updatedJobApplication);
			setIsEditing(false);
		} else {
			console.error("Failed to update job application");
		}
	};

	const handleUploadResume = async (file) => {
		const formData = new FormData();
		formData.append("resume", file);

		const response = await fetch(
			`http://localhost:5000/api/job-applications/${job._id}/upload-resume`,
			{
				method: "POST",
				body: formData,
			}
		);

		if (response.ok) {
			const updatedJobApplication = await response.json();
			onUpdate(updatedJobApplication);
		} else {
			console.error("Failed to upload resume");
		}
	};

	const handleDownloadResume = async () => {
		const response = await fetch(
			`http://localhost:5000/api/job-applications/${job._id}/download-resume`
		);
		const blob = await response.blob();
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "resume.pdf";
		document.body.appendChild(a);
		a.click();
		a.remove();
	};

	const handleDeleteResume = async () => {
		const response = await fetch(
			`http://localhost:5000/api/job-applications/${job._id}/delete-resume`,
			{
				method: "DELETE",
			}
		);

		if (response.ok) {
			const updatedJobApplication = await response.json();
			onUpdate(updatedJobApplication);
		} else {
			console.error("Failed to delete resume");
		}
	};

	return (
		<div className="job-application-card">
			{isEditing ? (
				<input
					type="text"
					name="role"
					value={editingData.role}
					onChange={handleEditChange}
				/>
			) : (
				<p>
					<strong>Role:</strong> {job.role}
				</p>
			)}

			{isEditing ? (
				<input
					type="text"
					name="company"
					value={editingData.company}
					onChange={handleEditChange}
				/>
			) : (
				<p>
					<strong>Company:</strong> {job.company}
				</p>
			)}

			{isEditing ? (
				<select
					name="status"
					value={editingData.status}
					onChange={handleEditChange}
				>
					<option value="submitted">Submitted</option>
					<option value="assessment">Assessment</option>
					<option value="interviewing">Interviewing</option>
					<option value="offer received">Offer Received</option>
					<option value="offer accepted">Offer Accepted</option>
				</select>
			) : (
				<p>
					<strong>Status:</strong> {job.status}
				</p>
			)}

			{isEditing ? (
				<input
					type="text"
					name="contact"
					value={editingData.contact}
					onChange={handleEditChange}
				/>
			) : (
				<p>
					<strong>Contact:</strong> {job.contact}
				</p>
			)}

			<div>
				<strong>Resume:</strong>
				{job.resume ? (
					<>
						<button onClick={handleDownloadResume}>Download</button>
						<input
							type="file"
							onChange={(e) => handleUploadResume(e.target.files[0])}
						/>
						<button onClick={handleDeleteResume}>Delete</button>
					</>
				) : (
					<>
						<input
							type="file"
							onChange={(e) => handleUploadResume(e.target.files[0])}
						/>
						<button>Generate</button>
					</>
				)}
			</div>

			<div className="actions">
				{isEditing ? (
					<button onClick={handleSaveEdit}>Save</button>
				) : (
					<button onClick={() => setIsEditing(true)}>Edit</button>
				)}
				<button onClick={() => onDelete(job._id)}>Delete</button>
			</div>
		</div>
	);
};

export default JobApplicationCard;
