import React, { useState, useEffect } from "react";
import JobApplicationCard from "../components/JobApplicationCard";
import AddJobApplicationForm from "./AddJobApplicationForm";
import "./JobApplications.css";
import { useAuth } from "../context/AuthContext";
import { createApiClient } from "../utils/api";

const JobApplications = () => {
	const { user } = useAuth();
	const api = createApiClient(user);
	const [applications, setApplications] = useState([]);
	const [loading, setLoading] = useState(true);
	const [editingId, setEditingId] = useState(null);
	const [editingData, setEditingData] = useState(null);

	// Fetch applications
	useEffect(() => {
		const fetchApplications = async () => {
			try {
				const data = await api.get("/job-applications");
				setApplications(data);
			} catch (error) {
				console.error("Error fetching applications:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchApplications();
	}, [api]);

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
			const updatedApplication = await api.put(
				`/job-applications/${editingData._id}`,
				editingData
			);
			setApplications((prev) =>
				prev.map((app) =>
					app._id === updatedApplication._id ? updatedApplication : app
				)
			);
			setEditingId(null);
			setEditingData(null);
		} catch (error) {
			console.error("Error updating application:", error);
		}
	};

	// Handle delete
	const handleDelete = async (id) => {
		try {
			await api.delete(`/job-applications/${id}`);
			setApplications((prev) => prev.filter((app) => app._id !== id));
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
		<div className="sm:m-5">
			{/* Desktop view container */}
			<div className="hidden sm:block rounded-lg shadow-lg overflow-hidden">
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

			{/* Mobile view */}
			<div className="sm:hidden bg-bone min-h-screen">
				{/* Floating header */}
				<div className="px-6 py-8">
					<h1 className="text-5xl font-semibold text-cerulean">Job Tracker</h1>
					<p className="text-gray-500 text-lg mt-1">
						Keep track of your applications
					</p>
				</div>

				{/* Cards container */}
				<div className="px-5">
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
		</div>
	);
};

export default JobApplications;
