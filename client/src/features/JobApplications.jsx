// client/src/features/JobApplications.jsx
import React, { useEffect, useState } from "react";

const JobApplications = () => {
	const [jobApplications, setJobApplications] = useState([]);

	useEffect(() => {
		fetch("/api/job-applications")
			.then((response) => response.json())
			.then((data) => setJobApplications(data))
			.catch((error) =>
				console.error("Error fetching job applications:", error)
			);
	}, []);

	return (
		<div>
			<h1>Job Applications</h1>
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
							<td>{job.role}</td>
							<td>{job.company}</td>
							<td>{job.status}</td>
							<td>{job.contact}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default JobApplications;
