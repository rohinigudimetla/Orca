// client/src/features/JobApplications.jsx
import React, { useEffect, useState } from "react";
import AddJobApplicationForm from "./AddJobApplicationForm";
import JobApplicationCard from "../components/JobApplicationCard"; // Import from components

const JobApplications = () => {
	const [jobApplications, setJobApplications] = useState([]);

	useEffect(() => {
		// Fetch all job applications from the server
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

	const handleUpdate = (updatedJobApplication) => {
		setJobApplications((prev) =>
			prev.map((job) =>
				job._id === updatedJobApplication._id ? updatedJobApplication : job
			)
		);
	};

	return (
		<div>
			<h1>Job Applications</h1>
			<AddJobApplicationForm onAdd={handleAdd} />
			<div className="job-applications-container">
				{jobApplications.map((job) => (
					<JobApplicationCard
						key={job._id}
						job={job}
						onDelete={handleDelete}
						onUpdate={handleUpdate}
					/>
				))}
			</div>
		</div>
	);
};

export default JobApplications;
