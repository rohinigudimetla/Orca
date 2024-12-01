import React, { useState } from "react";
import ResumeGeneratorModal from "./ResumeGeneratorModal";
import { useAuth } from "../context/AuthContext";
import { createApiClient } from "../utils/api";

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
	const { user } = useAuth();
	const api = createApiClient(user);

	const handleGenerateClick = () => {
		setIsGeneratorOpen(true);
	};

	const handleGeneratorClose = () => {
		setIsGeneratorOpen(false);
	};

	const handleSaveJD = async (jobDescription) => {
		try {
			const updatedApp = await api.put(`/job-applications/${application._id}`, {
				jobDescription,
			});
			onUpdate(updatedApp);
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
			const updatedApplication = await api.upload(
				`/job-applications/${application._id}/upload-resume`,
				formData
			);
			onUpdate(updatedApplication);
		} catch (error) {
			console.error("Failed to upload resume:", error);
		}
	};

	const handleDownloadResume = async () => {
		try {
			await api.download(
				`/job-applications/${application._id}/download-resume`,
				`resume_${application.company}.pdf`
			);
		} catch (error) {
			console.error("Failed to download resume:", error);
		}
	};

	const handleDeleteResume = async () => {
		try {
			const updatedApplication = await api.delete(
				`/job-applications/${application._id}/delete-resume`
			);
			onUpdate(updatedApplication);
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
								className="px-3 py-1.5 bg-seaGreen text-white rounded hover:bg-seaGreen/90"
							>
								Download
							</button>
							<button
								onClick={handleDeleteResume}
								className="px-3 py-1.5 bg-orange text-white rounded hover:bg-orange/90"
							>
								Delete
							</button>
							<button
								onClick={handleGenerateClick}
								className="px-3 py-1.5 bg-seaGreen text-white rounded hover:bg-seaGreen/90"
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
							className="px-3 py-1.5 bg-seaGreen text-white rounded hover:bg-seaGreen/90"
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
					applicationId={application._id}
					onGenerate={() => {}}
					onSaveJD={handleSaveJD}
				/>
			)}
		</div>
	);
};

export default JobApplicationCard;
