import React, { useState } from "react";
import ResumeGeneratorModal from "./ResumeGeneratorModal";
import { useAuth } from "../context/AuthContext";
import { createApiClient } from "../utils/api";
import DownloadIcon from "./icons/DownloadIcon";
import UploadIcon from "./icons/UploadIcon";
import EditIcon from "./icons/EditIcon";
import DeleteIcon from "./icons/DeleteIcon";
import GenerateIcon from "./icons/GenerateIcon";

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
	const [generatedResumeText, setGeneratedResumeText] = useState("");
	const [isExpanded, setIsExpanded] = useState(false);

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
		<div className="bg-white border border-gray-200 rounded-lg mb-2 overflow-hidden">
			{/* Desktop View */}
			<div className="hidden sm:grid sm:grid-cols-6 sm:items-center sm:p-4">
				<div className="px-3">
					<span className="font-medium">{application.role}</span>
				</div>
				<div className="px-3">
					<span>{application.company}</span>
				</div>
				<div className="px-3">
					<span className="capitalize">{application.status}</span>
				</div>
				<div className="px-3">
					<span>{application.contact || "No contact info"}</span>
				</div>
				<div className="col-span-2 px-3 flex gap-2">
					{application.resume ? (
						<>
							<button
								onClick={handleDownloadResume}
								className="px-2 py-2 bg-richBlack text-white rounded-full text-sm flex items-center gap-1"
							>
								<DownloadIcon />
							</button>
							<button
								onClick={handleDeleteResume}
								className="px-2 py-2 bg-orange text-white rounded-full text-sm flex items-center gap-1"
							>
								<DeleteIcon />
							</button>
							<button
								onClick={handleGenerateClick}
								className="px-2 py-2 bg-[#FF7F11] text-white rounded-full text-sm flex items-center gap-1"
							>
								<GenerateIcon />
							</button>
						</>
					) : (
						<>
							<input
								type="file"
								id={`resume-upload-${application._id}`}
								accept=".pdf"
								onChange={handleFileUpload}
								className="hidden"
							/>
							<label
								htmlFor={`resume-upload-${application._id}`}
								className="px-2 py-2 bg-richBlack text-white rounded-full text-sm cursor-pointer flex items-center gap-1"
							>
								<UploadIcon />
							</label>
							<button
								onClick={handleGenerateClick}
								className="px-2 py-2 bg-[#FF7F11] text-white rounded-full text-sm flex items-center gap-1"
							>
								<GenerateIcon />
							</button>
						</>
					)}
					{isEditing ? (
						<button
							onClick={onSaveEdit}
							className="px-2 py-2 bg-seaGreen text-white rounded-full text-sm"
						>
							Save
						</button>
					) : (
						<button
							onClick={onEditClick}
							className="px-2 py-2 bg-seaGreen text-white rounded-full text-sm flex items-center gap-1"
						>
							<EditIcon />
						</button>
					)}
					<button
						onClick={() => onDelete(application._id)}
						className="px-2 py-2 bg-orange text-white rounded-full text-sm flex items-center gap-1"
					>
						<DeleteIcon />
					</button>
				</div>
			</div>

			{/* Mobile View */}
			<div className="sm:hidden">
				{/* Mobile content from previous version */}
				<div className="p-3 flex items-center justify-between">
					<div className="flex-1">
						<span className="font-medium block">{application.role}</span>
						<span className="text-sm text-gray-500">{application.company}</span>
						<span className="text-xs bg-seaGreen/10 text-seaGreen px-2 py-0.5 rounded-full mt-1 inline-block capitalize">
							{application.status}
						</span>
					</div>

					<button
						onClick={() => setIsExpanded(!isExpanded)}
						className="ml-2 p-2 hover:bg-gray-100 rounded-full transition-colors"
					>
						<svg
							className={`w-5 h-5 transform transition-transform ${
								isExpanded ? "rotate-180" : ""
							}`}
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M19 9l-7 7-7-7"
							/>
						</svg>
					</button>
				</div>

				{isExpanded && (
					<div className="border-t border-gray-200 p-3 space-y-4 bg-gray-50">
						{/* Contact Info */}
						<div>
							<span className="text-xs text-gray-500 uppercase tracking-wider">
								Contact
							</span>
							{isEditing ? (
								<input
									type="text"
									name="contact"
									value={editingData.contact}
									onChange={onEditChange}
									className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-seaGreen bg-white"
								/>
							) : (
								<span className="block mt-1">
									{application.contact || "No contact info"}
								</span>
							)}
						</div>

						{/* Resume Actions */}
						<div>
							<span className="text-xs text-gray-500 uppercase tracking-wider block mb-2">
								Resume Actions
							</span>
							{application.resume ? (
								<div className="flex flex-wrap gap-2">
									<button
										onClick={handleDownloadResume}
										className="flex-1 px-2 py-2 bg-richBlack text-white rounded-full text-sm font-medium flex items-center justify-center gap-1"
									>
										<DownloadIcon />
									</button>
									<button
										onClick={handleDeleteResume}
										className="flex-1 px-2 py-2 bg-orange text-white rounded-full text-sm font-medium flex items-center justify-center gap-1"
									>
										<DeleteIcon />
									</button>
									<button
										onClick={handleGenerateClick}
										className="flex-1 px-2 py-2 bg-[#FF7F11] text-white rounded-full text-sm font-medium flex items-center justify-center gap-1"
									>
										<GenerateIcon />
									</button>
								</div>
							) : (
								<div className="flex flex-wrap gap-2">
									<input
										type="file"
										id={`resume-upload-${application._id}`}
										accept=".pdf"
										onChange={handleFileUpload}
										className="hidden"
									/>
									<label
										htmlFor={`resume-upload-${application._id}`}
										className="flex-1 px-2 py-2 bg-richBlack text-white rounded-full text-sm font-medium text-center flex items-center justify-center gap-1"
									>
										<UploadIcon />
									</label>
									<button
										onClick={handleGenerateClick}
										className="flex-1 px-2 py-2 bg-[#FF7F11] text-white rounded-full text-sm font-medium flex items-center justify-center gap-1"
									>
										<GenerateIcon />
									</button>
								</div>
							)}
						</div>

						{/* Card Actions */}
						<div className="flex gap-2">
							{isEditing ? (
								<button
									onClick={onSaveEdit}
									className="flex-1 px-2 py-2 bg-seaGreen text-white rounded-full text-sm font-medium"
								>
									Save
								</button>
							) : (
								<button
									onClick={onEditClick}
									className="flex-1 px-2 py-2 bg-seaGreen text-white rounded-full text-sm font-medium flex items-center justify-center gap-1"
								>
									<EditIcon />
								</button>
							)}
							<button
								onClick={() => onDelete(application._id)}
								className="flex-1 px-2 py-2 bg-orange text-white rounded-full text-sm font-medium flex items-center justify-center gap-1"
							>
								<DeleteIcon />
							</button>
						</div>
					</div>
				)}
			</div>

			{/* Keep the modal */}
			{isGeneratorOpen && (
				<ResumeGeneratorModal
					isOpen={isGeneratorOpen}
					onClose={handleGeneratorClose}
					jobDescription={application.jobDescription}
					resumeText={application.resumeText}
					generatedResume={generatedResumeText}
					setGeneratedResume={setGeneratedResumeText}
					onSaveJD={handleSaveJD}
					applicationId={application._id}
				/>
			)}
		</div>
	);
};

export default JobApplicationCard;
