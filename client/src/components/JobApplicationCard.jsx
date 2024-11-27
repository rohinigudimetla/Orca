import React, { useState } from "react";
import ResumeGeneratorModal from "./ResumeGeneratorModal";

const JobApplicationCard = ({
	application,
	onDelete,
	isEditing,
	editingData,
	onEditChange,
	onEditClick,
	onSaveEdit,
	onUpdate,
}) => {
	const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);

	const handleGenerateClick = () => {
		setIsGeneratorOpen(true);
	};

	const handleGeneratorClose = () => {
		setIsGeneratorOpen(false);
	};

	const handleSaveJD = async (jobDescription) => {
		try {
			const response = await fetch(
				`http://localhost:5000/api/job-applications/${application._id}`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ jobDescription }),
				}
			);

			if (response.ok) {
				const updatedApp = await response.json();
				onUpdate(updatedApp);
			}
		} catch (error) {
			console.error("Failed to save job description:", error);
		}
	};

	const handleFileUpload = async (event) => {
		const file = event.target.files[0];
		if (!file) return;

		const formData = new FormData();
		formData.append("resume", file);

		try {
			const response = await fetch(
				`http://localhost:5000/api/job-applications/${application._id}/upload-resume`,
				{
					method: "POST",
					body: formData,
				}
			);

			if (response.ok) {
				const updatedApplication = await response.json();
				onUpdate(updatedApplication);
			}
		} catch (error) {
			console.error("Failed to upload resume:", error);
		}
	};

	const handleDownloadResume = async () => {
		try {
			const response = await fetch(
				`http://localhost:5000/api/job-applications/${application._id}/download-resume`,
				{ method: "GET" }
			);
			if (response.ok) {
				const blob = await response.blob();
				const url = window.URL.createObjectURL(blob);
				const a = document.createElement("a");
				a.href = url;
				a.download = `resume_${application.company}.pdf`;
				document.body.appendChild(a);
				a.click();
				window.URL.revokeObjectURL(url);
				a.remove();
			}
		} catch (error) {
			console.error("Failed to download resume:", error);
		}
	};

	const handleDeleteResume = async () => {
		try {
			const response = await fetch(
				`http://localhost:5000/api/job-applications/${application._id}/delete-resume`,
				{ method: "DELETE" }
			);
			if (response.ok) {
				const updatedApplication = await response.json();
				onUpdate(updatedApplication);
			}
		} catch (error) {
			console.error("Failed to delete resume:", error);
		}
	};

	return (
		<div className="grid grid-cols-6 border-b border-gray-200 hover:bg-gray-50 transition-colors">
			{/* Role Cell */}
			<div className="p-3 flex items-center">
				{isEditing ? (
					<input
						type="text"
						name="role"
						value={editingData.role}
						onChange={onEditChange}
						className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
					/>
				) : (
					application.role
				)}
			</div>

			{/* Company Cell */}
			<div className="p-3 flex items-center">
				{isEditing ? (
					<input
						type="text"
						name="company"
						value={editingData.company}
						onChange={onEditChange}
						className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
					/>
				) : (
					application.company
				)}
			</div>

			{/* Status Cell */}
			<div className="p-3 flex items-center">
				{isEditing ? (
					<select
						name="status"
						value={editingData.status}
						onChange={onEditChange}
						className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
					>
						<option value="submitted">Submitted</option>
						<option value="assessment">Assessment</option>
						<option value="interviewing">Interviewing</option>
						<option value="offer received">Offer Received</option>
						<option value="offer accepted">Offer Accepted</option>
					</select>
				) : (
					application.status
				)}
			</div>

			{/* Contact Cell */}
			<div className="p-3 flex items-center">
				{isEditing ? (
					<input
						type="text"
						name="contact"
						value={editingData.contact}
						onChange={onEditChange}
						className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
					/>
				) : (
					application.contact
				)}
			</div>

			{/* Resume Cell */}
			<div className="p-3 flex flex-col gap-2">
				{application.resume ? (
					<>
						<div className="flex gap-2">
							<button
								onClick={handleDownloadResume}
								className="px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600"
							>
								Download
							</button>
							<button
								onClick={handleDeleteResume}
								className="px-3 py-1.5 bg-red-500 text-white rounded hover:bg-red-600"
							>
								Delete
							</button>
							<button
								onClick={handleGenerateClick}
								className="px-3 py-1.5 bg-orange-500 text-white rounded hover:bg-orange-600"
							>
								Generate
							</button>
						</div>
					</>
				) : (
					<div className="flex gap-2">
						<input
							type="file"
							id={`resume-upload-${application._id}`}
							accept=".pdf"
							onChange={handleFileUpload}
							className="hidden"
						/>
						<label
							htmlFor={`resume-upload-${application._id}`}
							className="px-3 py-1.5 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer"
						>
							Upload
						</label>
						<button
							onClick={handleGenerateClick}
							className="px-3 py-1.5 bg-orange-500 text-white rounded hover:bg-orange-600"
						>
							Generate
						</button>
					</div>
				)}
			</div>

			{/* Actions Cell */}
			<div className="p-3 flex items-center gap-2">
				{isEditing ? (
					<button
						onClick={onSaveEdit}
						className="px-3 py-1.5 bg-green-500 text-white rounded hover:bg-green-600"
					>
						Save
					</button>
				) : (
					<button
						onClick={onEditClick}
						className="px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600"
					>
						Edit
					</button>
				)}
				<button
					onClick={() => onDelete(application._id)}
					className="px-3 py-1.5 bg-red-500 text-white rounded hover:bg-red-600"
				>
					Delete
				</button>
			</div>

			{isGeneratorOpen && (
				<ResumeGeneratorModal
					isOpen={isGeneratorOpen}
					onClose={handleGeneratorClose}
					jobDescription={application.jobDescription}
					resumeText={application.resumeText}
					onGenerate={() => {}}
					onSaveJD={handleSaveJD}
				/>
			)}
		</div>
	);
};

export default JobApplicationCard;
