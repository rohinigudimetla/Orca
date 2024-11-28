import React, { useState } from "react";

const ResumeGeneratorModal = ({
	isOpen,
	onClose,
	jobDescription,
	resumeText,
	onGenerate,
	onSaveJD,
	applicationId,
}) => {
	const [jd, setJd] = useState(jobDescription || "");
	const [prompt, setPrompt] = useState(
		"Please modify my resume to better match this job description. Highlight relevant skills and experiences, while maintaining truthfulness. Make it more impactful and targeted."
	);
	const [generatedResume, setGeneratedResume] = useState("");
	const [isGenerating, setIsGenerating] = useState(false);
	const [showSaveIndicator, setShowSaveIndicator] = useState(false);

	if (!isOpen) return null;

	const handleSave = async () => {
		await onSaveJD(jd);
		setShowSaveIndicator(true);
		setTimeout(() => setShowSaveIndicator(false), 2000);
	};

	const handleGenerate = async () => {
		setIsGenerating(true);
		try {
			const response = await fetch(
				`http://localhost:5000/api/job-applications/${applicationId}/generate-resume`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ prompt }),
				}
			);

			if (response.ok) {
				const data = await response.json();
				setGeneratedResume(data.modifiedResume);
			}
		} catch (error) {
			console.error("Failed to generate resume:", error);
		} finally {
			setIsGenerating(false);
		}
	};

	return (
		<div className="fixed inset-0 bg-richBlack/50 flex items-center justify-center z-50">
			<div className="bg-bone rounded-lg p-6 w-11/12 max-w-2xl max-h-[90vh] overflow-y-auto">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-xl font-semibold text-richBlack">
						Generate Resume
					</h2>
					<button
						onClick={onClose}
						className="text-richBlack hover:text-orange"
					>
						×
					</button>
				</div>

				<div className="mb-6">
					<label className="block text-sm font-medium text-richBlack mb-2">
						Job Description
					</label>
					<textarea
						value={jd}
						onChange={(e) => setJd(e.target.value)}
						className="w-full min-h-[200px] p-3 border border-richBlack/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-seaGreen bg-white"
						placeholder="Enter job description..."
					/>
				</div>

				<div className="mb-6">
					<label className="block text-sm font-medium text-richBlack mb-2">
						AI Instructions
					</label>
					<textarea
						value={prompt}
						onChange={(e) => setPrompt(e.target.value)}
						className="w-full h-[100px] p-3 border border-richBlack/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-seaGreen bg-white"
						placeholder="Enter instructions for AI..."
					/>
				</div>

				<div className="mb-6">
					<label className="block text-sm font-medium text-richBlack mb-2">
						Resume Text
					</label>
					<div className="w-full h-[200px] p-3 border border-richBlack/20 rounded-lg bg-white overflow-y-auto whitespace-pre-wrap">
						{resumeText || "No resume text available"}
					</div>
				</div>

				{generatedResume && (
					<div className="mb-6">
						<label className="block text-sm font-medium text-richBlack mb-2">
							Generated Resume
						</label>
						<div className="w-full h-[200px] p-3 border border-richBlack/20 rounded-lg bg-white overflow-y-auto whitespace-pre-wrap">
							{generatedResume}
						</div>
					</div>
				)}

				{isGenerating && (
					<div className="text-center mb-4">
						<span className="text-orange-500">Generating resume...</span>
					</div>
				)}

				<div className="flex justify-end gap-3 items-center">
					{showSaveIndicator && (
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
					)}
					<button
						onClick={handleSave}
						className="px-4 py-2 bg-seaGreen text-white rounded hover:bg-seaGreen/90 transition-colors"
					>
						Save Description
					</button>
					<button
						onClick={handleGenerate}
						disabled={isGenerating}
						className="px-4 py-2 bg-seaGreen text-white rounded hover:bg-seaGreen/90 transition-colors disabled:bg-celadon disabled:cursor-not-allowed"
					>
						{isGenerating ? "Generating..." : "Generate"}
					</button>
					<button
						onClick={onClose}
						className="px-4 py-2 bg-richBlack text-white rounded hover:bg-richBlack/90 transition-colors"
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
};

export default ResumeGeneratorModal;
