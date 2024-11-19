import React, { useState, useEffect } from "react";
import JobApplicationCard from "../components/JobApplicationCard";
import AddJobApplicationForm from "./AddJobApplicationForm";
import "./JobApplications.css";

const JobApplications = () => {
	const [applications, setApplications] = useState([]);
	const [loading, setLoading] = useState(true);
	const [editingId, setEditingId] = useState(null);
	const [editingData, setEditingData] = useState(null);

	// Fetch applications
	useEffect(() => {
		const fetchApplications = async () => {
			try {
				const response = await fetch(
					"http://localhost:5000/api/job-applications"
				);
				const data = await response.json();
				setApplications(data);
			} catch (error) {
				console.error("Error fetching applications:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchApplications();
	}, []);

	// Handle editing
	const handleEditClick = (application) => {
		setEditingId(application._id);
		setEditingData({ ...application });
	};

	const handleEditChange = (e) => {
		const { name, value } = e.target;
		setEditingData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSaveEdit = async () => {
		try {
			const response = await fetch(
				`http://localhost:5000/api/job-applications/${editingData._id}`,
				{
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(editingData),
				}
			);
			if (response.ok) {
				const updatedApplication = await response.json();
				setApplications((prev) =>
					prev.map((app) =>
						app._id === updatedApplication._id ? updatedApplication : app
					)
				);
				setEditingId(null);
				setEditingData(null);
			}
		} catch (error) {
			console.error("Error updating application:", error);
		}
	};

	// Handle delete
	const handleDelete = async (id) => {
		try {
			const response = await fetch(
				`http://localhost:5000/api/job-applications/${id}`,
				{
					method: "DELETE",
				}
			);
			if (response.ok) {
				setApplications((prev) => prev.filter((app) => app._id !== id));
			}
		} catch (error) {
			console.error("Error deleting application:", error);
		}
	};

	// Handle add new application
	const handleAdd = (newApplication) => {
		setApplications((prev) => [...prev, newApplication]);
	};

	if (loading) {
		return <div className="loading">Loading applications...</div>;
	}

	return (
		<div className="applications-container">
			<div className="applications-header">
				<div className="header-cell">Role</div>
				<div className="header-cell">Company</div>
				<div className="header-cell">Status</div>
				<div className="header-cell">Contact</div>
				<div className="header-cell">Resume</div>
				<div className="header-cell">Actions</div>
			</div>
			<div className="applications-body">
				{applications.length > 0 ? (
					applications.map((application) => (
						<JobApplicationCard
							key={application._id}
							application={application}
							onDelete={handleDelete}
							isEditing={editingId === application._id}
							editingData={editingId === application._id ? editingData : null}
							onEditChange={handleEditChange}
							onEditClick={() => handleEditClick(application)}
							onSaveEdit={handleSaveEdit}
						/>
					))
				) : (
					<div className="no-applications-message">
						No job applications found. Add your first application below!
					</div>
				)}
				<AddJobApplicationForm onAdd={handleAdd} />
			</div>
		</div>
	);
};

export default JobApplications;
