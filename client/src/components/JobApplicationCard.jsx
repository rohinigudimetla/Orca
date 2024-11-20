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
	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleGenerateClick = () => {
		setIsModalOpen(true);
	};

	const handleSaveJD = async (newJD) => {
		try {
			const response = await fetch(
				`http://localhost:5000/api/job-applications/${application._id}`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						...application,
						jobDescription: newJD,
					}),
				}
			);

			if (!response.ok) {
				throw new Error("Failed to update job description");
			}

			const updatedApplication = await response.json();
			onUpdate(updatedApplication);
		} catch (error) {
			console.error("Error updating job description:", error);
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
			<div className="p-3 flex items-center gap-2">
				{application.resume ? (
					<div className="flex gap-2">
						<button className="px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600">
							Download
						</button>
						<button className="px-3 py-1.5 bg-red-500 text-white rounded hover:bg-red-600">
							Delete
						</button>
						<button
							onClick={handleGenerateClick}
							className="px-3 py-1.5 bg-orange-500 text-white rounded hover:bg-orange-600"
						>
							Generate
						</button>
					</div>
				) : (
					<div className="flex gap-2">
						<input
							type="file"
							id={`resume-upload-${application._id}`}
							accept=".pdf"
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

			<ResumeGeneratorModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				jobDescription={application.jobDescription || ""}
				onGenerate={handleGenerateClick}
				onSaveJD={handleSaveJD}
			/>
		</div>
	);
};

export default JobApplicationCard;
