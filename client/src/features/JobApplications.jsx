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
		return (
			<div className="flex justify-center items-center p-8">
				Loading applications...
			</div>
		);
	}

	return (
		<div className="m-5 rounded-lg shadow-lg overflow-hidden">
			<div className="grid grid-cols-6 bg-gray-50 font-semibold border-b-2 border-gray-200">
				<div className="p-4">Role</div>
				<div className="p-4">Company</div>
				<div className="p-4">Status</div>
				<div className="p-4">Contact</div>
				<div className="p-4">Resume</div>
				<div className="p-4">Actions</div>
			</div>
			<div className="bg-white">
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
							onUpdate={(updatedApp) => {
								setApplications((prev) =>
									prev.map((app) =>
										app._id === updatedApp._id ? updatedApp : app
									)
								);
							}}
						/>
					))
				) : (
					<div className="p-8 text-center text-gray-500">
						No job applications found. Add your first application below!
					</div>
				)}
				<AddJobApplicationForm onAdd={handleAdd} />
			</div>
		</div>
	);
};

export default JobApplications;
