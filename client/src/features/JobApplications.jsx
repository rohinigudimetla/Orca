// client/src/features/JobApplications.jsx
import React, { useEffect, useState } from "react";
import AddJobApplicationForm from "./AddJobApplicationForm"; // Import your form component

const JobApplications = () => {
	const [jobApplications, setJobApplications] = useState([]);
	const [isEditing, setIsEditing] = useState(null); // Track which job is being edited
	const [editingData, setEditingData] = useState({}); // Data for the job being edited

	useEffect(() => {
		fetch("http://localhost:5000/api/job-applications")
			.then((response) => response.json())
			.then((data) => setJobApplications(data))
			.catch((error) =>
				console.error("Error fetching job applications:", error)
			);
	}, []);

	const handleAdd = (newJobApplication) => {
		setJobApplications([...jobApplications, newJobApplication]);
	};

	const handleEditChange = (e, jobId) => {
		const { name, value } = e.target;
		setEditingData({ ...editingData, [name]: value });
	};

	const handleEdit = (job) => {
		setIsEditing(job._id);
		setEditingData(job);
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
			setJobApplications((prev) =>
				prev.map((job) =>
					job._id === updatedJobApplication._id ? updatedJobApplication : job
				)
			);
			setIsEditing(null);
			setEditingData({});
		} else {
			console.error("Failed to update job application");
		}
	};

	const handleDelete = async (jobId) => {
		const response = await fetch(
			`http://localhost:5000/api/job-applications/${jobId}`,
			{
				method: "DELETE",
			}
		);

		if (response.ok) {
			setJobApplications((prev) => prev.filter((job) => job._id !== jobId));
		} else {
			console.error("Failed to delete job application");
		}
	};

	return (
		<div>
			<h1>Job Applications</h1>
			<AddJobApplicationForm onAdd={handleAdd} />
			<table>
				<thead>
					<tr>
						<th>Role</th>
						<th>Company</th>
						<th>Status</th>
						<th>Contact</th>
					</tr>
				</thead>
				<tbody>
					{jobApplications.map((job) => (
						<tr key={job._id}>
							<td onClick={() => handleEdit(job)}>
								{isEditing === job._id ? (
									<input
										type="text"
										name="role"
										value={editingData.role}
										onChange={(e) => handleEditChange(e, job._id)}
									/>
								) : (
									job.role
								)}
							</td>
							<td onClick={() => handleEdit(job)}>
								{isEditing === job._id ? (
									<input
										type="text"
										name="company"
										value={editingData.company}
										onChange={(e) => handleEditChange(e, job._id)}
									/>
								) : (
									job.company
								)}
							</td>
							<td onClick={() => handleEdit(job)}>
								{isEditing === job._id ? (
									<select
										name="status"
										value={editingData.status}
										onChange={(e) => handleEditChange(e, job._id)}
									>
										<option value="submitted">Submitted</option>
										<option value="assessment">Assessment</option>
										<option value="interviewing">Interviewing</option>
										<option value="offer received">Offer Received</option>
										<option value="offer accepted">Offer Accepted</option>
									</select>
								) : (
									job.status
								)}
							</td>
							<td onClick={() => handleEdit(job)}>
								{isEditing === job._id ? (
									<input
										type="text"
										name="contact"
										value={editingData.contact}
										onChange={(e) => handleEditChange(e, job._id)}
									/>
								) : (
									job.contact
								)}
							</td>
							<td>
								{isEditing === job._id ? (
									<button onClick={handleSaveEdit}>Save</button>
								) : (
									<button onClick={() => handleDelete(job._id)}>Delete</button>
								)}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default JobApplications;
