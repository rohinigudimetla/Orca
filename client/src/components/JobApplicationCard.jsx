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
		<div className="bg-white border border-gray-200 rounded-3xl mb-2 overflow-hidden">
			{/* Desktop View */}
			<div className="hidden sm:grid sm:grid-cols-6 sm:items-center sm:p-4">
				<div className="px-3">
					{isEditing ? (
						<input
							type="text"
							name="role"
							value={editingData.role}
							onChange={onEditChange}
							className="w-full p-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-seaGreen bg-white"
							placeholder="Role"
						/>
					) : (
						<span className="font-medium">{application.role}</span>
					)}
				</div>
				<div className="px-3">
					{isEditing ? (
						<input
							type="text"
							name="company"
							value={editingData.company}
							onChange={onEditChange}
							className="w-full p-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-seaGreen bg-white"
							placeholder="Company"
						/>
					) : (
						<span>{application.company}</span>
					)}
				</div>
				<div className="px-3">
					{isEditing ? (
						<select
							name="status"
							value={editingData.status}
							onChange={onEditChange}
							className="w-full p-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-seaGreen bg-white"
						>
							<option value="submitted">Submitted</option>
							<option value="assessment">Assessment</option>
							<option value="interviewing">Interviewing</option>
							<option value="offer received">Offer Received</option>
							<option value="offer accepted">Offer Accepted</option>
							<option value="offer rejected">Offer Rejected</option>
							<option value="hired">Hired</option>
							<option value="rejected">Rejected</option>
						</select>
					) : (
						<span className="capitalize">{application.status}</span>
					)}
				</div>
				<div className="px-3">
					{isEditing ? (
						<input
							type="text"
							name="contact"
							value={editingData.contact}
							onChange={onEditChange}
							className="w-full p-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-seaGreen bg-white"
							placeholder="Contact"
						/>
					) : (
						<span>{application.contact || "No contact info"}</span>
					)}
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
				<div
					className="p-6 cursor-pointer flex flex-col gap-2 transition-all duration-200 ease-out"
					onClick={() => setIsExpanded(!isExpanded)}
				>
					<div className="flex justify-between items-start animate-fade-in">
						<div className="space-y-2">
							{isEditing ? (
								<div className="space-y-3">
									<input
										type="text"
										name="role"
										value={editingData.role}
										onChange={onEditChange}
										className="w-full p-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-seaGreen bg-white text-base"
										placeholder="Role"
									/>
									<input
										type="text"
										name="company"
										value={editingData.company}
										onChange={onEditChange}
										className="w-full p-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-seaGreen bg-white text-base"
										placeholder="Company"
									/>
									<select
										name="status"
										value={editingData.status}
										onChange={onEditChange}
										className="w-full p-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-seaGreen bg-white text-2xl"
										style={{ fontSize: "16px" }}
									>
										<option value="submitted">Submitted</option>
										<option value="assessment">Assessment</option>
										<option value="interviewing">Interviewing</option>
										<option value="offer received">Offer Received</option>
										<option value="offer accepted">Offer Accepted</option>
										<option value="offer rejected">Offer Rejected</option>
										<option value="hired">Hired</option>
										<option value="rejected">Rejected</option>
									</select>
								</div>
							) : (
								<>
									<span className="font-medium block text-2xl">
										{application.role}
									</span>
									<span className="text-lg text-gray-500 block">
										{application.company}
									</span>
									<span
										className={`status-badge text-base px-4 py-2 rounded-full capitalize inline-flex
                        ${
													application.status === "submitted"
														? "bg-cerulean/10 text-cerulean"
														: ""
												}
                        ${
													application.status === "assessment"
														? "bg-[#9747FF]/10 text-[#9747FF]"
														: ""
												}
                        ${
													application.status === "interviewing"
														? "bg-seaGreen/10 text-seaGreen"
														: ""
												}
                        ${
													application.status === "offer received"
														? "bg-[#38B000]/10 text-[#38B000]"
														: ""
												}
                        ${
													application.status === "offer accepted"
														? "bg-[#38B000]/10 text-[#38B000]"
														: ""
												}
                        ${
													application.status === "offer rejected"
														? "bg-orange/10 text-orange"
														: ""
												}
                        ${
													application.status === "hired"
														? "bg-[#38B000]/10 text-[#38B000]"
														: ""
												}
                        ${
													application.status === "rejected"
														? "bg-orange/10 text-orange"
														: ""
												}`}
									>
										{application.status}
									</span>
								</>
							)}
						</div>
					</div>
				</div>

				{isExpanded && (
					<div
						className={`
						border-t border-gray-200 p-3 space-y-4 bg-gray-50
						transform transition-all duration-300 ease-out
						${isExpanded ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"}
					`}
						onClick={(e) => e.stopPropagation()}
					>
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
									className="w-full mt-1 p-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-seaGreen bg-white text-base"
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
