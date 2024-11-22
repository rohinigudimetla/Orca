import React, { useState } from "react";

const ResumeGeneratorModal = ({
	isOpen,
	onClose,
	jobDescription,
	resumeText,
	onGenerate,
	onSaveJD,
}) => {
	const [jd, setJd] = useState(jobDescription || "");
	const [showSaveIndicator, setShowSaveIndicator] = useState(false);

	if (!isOpen) return null;

	const handleSave = async () => {
		await onSaveJD(jd);
		setShowSaveIndicator(true);
		setTimeout(() => setShowSaveIndicator(false), 2000);
	};

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
			<div className="bg-white rounded-lg p-6 w-11/12 max-w-2xl">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-xl font-semibold">Generate Resume</h2>
					<button
						onClick={onClose}
						className="text-gray-500 hover:text-gray-700"
					>
						×
					</button>
				</div>

				<div className="mb-6">
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Job Description
					</label>
					<textarea
						value={jd}
						onChange={(e) => setJd(e.target.value)}
						className="w-full min-h-[200px] p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder="Enter job description..."
					/>
				</div>

				<div className="mb-6">
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Resume Text
					</label>
					<div className="w-full min-h-[200px] p-3 border border-gray-300 rounded-lg bg-gray-50 overflow-y-auto whitespace-pre-wrap">
						{resumeText || "No resume text available"}
					</div>
				</div>

				<div className="flex justify-end gap-3 items-center">
					<div
						className={`transition-opacity duration-300 ${
							showSaveIndicator ? "opacity-100" : "opacity-0"
						}`}
					>
						<span className="text-green-500 flex items-center gap-1">
							<svg
								className="w-4 h-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M5 13l4 4L19 7"
								/>
							</svg>
							Saved
						</span>
					</div>
					<button
						onClick={handleSave}
						className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
					>
						Save Description
					</button>
					<button
						onClick={() => onGenerate(jd)}
						className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
					>
						Generate
					</button>
					<button
						onClick={onClose}
						className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
};

export default ResumeGeneratorModal;
