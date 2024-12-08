import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { createApiClient } from "../utils/api";

const AddJobApplicationForm = ({ onAdd }) => {
	const { user } = useAuth();
	const api = createApiClient(user);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const [formData, setFormData] = useState({
		role: "",
		company: "",
		status: "submitted",
		contact: "",
		resume: null,
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleFileChange = (e) => {
		setFormData({ ...formData, resume: e.target.files[0] });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const submissionData = new FormData();

		Object.keys(formData).forEach((key) => {
			if (formData[key]) {
				submissionData.append(key, formData[key]);
			}
		});

		try {
			const newJobApplication = await api.upload(
				"/job-applications",
				submissionData
			);

			onAdd(newJobApplication);
			setFormData({
				role: "",
				company: "",
				status: "submitted",
				contact: "",
				resume: null,
			});
			setIsModalOpen(false);
		} catch (error) {
			console.error("Failed to add job application:", error);
			alert("Failed to create job application. Please try again.");
		}
	};

	return (
		<>
			{/* Desktop Form - Original Grid Layout */}
			<div className="hidden sm:block">
				<form
					onSubmit={handleSubmit}
					className="grid grid-cols-6 bg-gray-50 border-t-2 border-gray-200 border-dashed hover:bg-white transition-colors sticky bottom-4"
				>
					<div className="p-3">
						<input
							type="text"
							name="role"
							placeholder="Role"
							value={formData.role}
							onChange={handleChange}
							required
							className="w-full p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-seaGreen bg-transparent"
						/>
					</div>
					<div className="p-3">
						<input
							type="text"
							name="company"
							placeholder="Company"
							value={formData.company}
							onChange={handleChange}
							required
							className="w-full p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-seaGreen bg-transparent"
						/>
					</div>
					<div className="p-3">
						<select
							name="status"
							value={formData.status}
							onChange={handleChange}
							className="w-full p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-seaGreen bg-transparent"
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
					<div className="p-3">
						<input
							type="text"
							name="contact"
							placeholder="Contact"
							value={formData.contact}
							onChange={handleChange}
							required
							className="w-full p-2 border border-gray-300 rounded-full bg-white focus:outline-none focus:border-seaGreen focus:ring-2 focus:ring-seaGreen/10"
						/>
					</div>
					<div className="p-3">
						<input
							type="file"
							name="resume"
							onChange={handleFileChange}
							required
							className="w-full p-2 border border-gray-300 rounded-full bg-white focus:outline-none focus:border-seaGreen focus:ring-2 focus:ring-seaGreen/10"
						/>
					</div>
					<div className="p-3">
						<button
							type="submit"
							className="px-4 py-2 bg-seaGreen text-white rounded-full hover:bg-seaGreen/90 transition-colors"
						>
							Add
						</button>
					</div>
				</form>
			</div>

			{/* Mobile Add Button */}
			<div className="sm:hidden fixed bottom-6 right-6">
				<button
					onClick={() => setIsModalOpen(true)}
					className="w-14 h-14 bg-seaGreen text-white rounded-full shadow-lg flex items-center justify-center hover:bg-seaGreen/90 transition-colors"
				>
					<svg
						className="w-6 h-6"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M12 4v16m8-8H4"
						/>
					</svg>
				</button>
			</div>

			{/* Mobile Modal */}
			{isModalOpen && (
				<div className="fixed inset-0 bg-richBlack/50 flex items-end sm:hidden z-50">
					<div className="bg-white w-full rounded-t-xl p-4">
						<div className="flex justify-between items-center mb-4">
							<h3 className="text-lg font-semibold">Add New Application</h3>
							<button
								onClick={() => setIsModalOpen(false)}
								className="text-2xl"
							>
								&times;
							</button>
						</div>
						<form onSubmit={handleSubmit} className="space-y-4">
							<input
								type="text"
								name="role"
								placeholder="Role"
								value={formData.role}
								onChange={handleChange}
								required
								className="w-full p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-seaGreen bg-transparent"
							/>
							<input
								type="text"
								name="company"
								placeholder="Company"
								value={formData.company}
								onChange={handleChange}
								required
								className="w-full p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-seaGreen bg-transparent"
							/>
							<select
								name="status"
								value={formData.status}
								onChange={handleChange}
								className="w-full p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-seaGreen bg-transparent"
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
							<input
								type="text"
								name="contact"
								placeholder="Contact"
								value={formData.contact}
								onChange={handleChange}
								required
								className="w-full p-2 border border-gray-300 rounded-full bg-white focus:outline-none focus:border-seaGreen focus:ring-2 focus:ring-seaGreen/10"
							/>
							<input
								type="file"
								name="resume"
								onChange={handleFileChange}
								required
								className="w-full p-2 border border-gray-300 rounded-full bg-white focus:outline-none focus:border-seaGreen focus:ring-2 focus:ring-seaGreen/10"
							/>
							<button
								type="submit"
								className="w-full py-3 bg-seaGreen text-white rounded-full"
							>
								Add Application
							</button>
						</form>
					</div>
				</div>
			)}
		</>
	);
};

export default AddJobApplicationForm;
