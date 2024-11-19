import React from "react";
import "./JobApplicationCard.css";

const JobApplicationCard = ({
	application,
	onDelete,
	isEditing,
	editingData,
	onEditChange,
	onEditClick,
	onSaveEdit,
}) => {
	return (
		<div className="application-row">
			<div className="cell">
				{isEditing ? (
					<input
						type="text"
						name="role"
						value={editingData.role}
						onChange={onEditChange}
					/>
				) : (
					application.role
				)}
			</div>
			<div className="cell">
				{isEditing ? (
					<input
						type="text"
						name="company"
						value={editingData.company}
						onChange={onEditChange}
					/>
				) : (
					application.company
				)}
			</div>
			<div className="cell">
				{isEditing ? (
					<select
						name="status"
						value={editingData.status}
						onChange={onEditChange}
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
			<div className="cell">
				{isEditing ? (
					<input
						type="text"
						name="contact"
						value={editingData.contact}
						onChange={onEditChange}
					/>
				) : (
					application.contact
				)}
			</div>
			<div className="cell resume-cell">
				{application.resume ? (
					<div className="resume-actions">
						<button className="download-btn">Download</button>
						<button className="delete-btn">Delete</button>
						<button className="generate-btn">Generate</button>
					</div>
				) : (
					<div className="resume-actions">
						<div className="upload-container">
							<input
								type="file"
								id={`resume-upload-${application._id}`}
								accept=".pdf"
								style={{ display: "none" }}
							/>
							<label
								htmlFor={`resume-upload-${application._id}`}
								className="upload-btn"
							>
								Upload
							</label>
						</div>
						<button className="generate-btn">Generate</button>
					</div>
				)}
			</div>
			<div className="cell actions-cell">
				{isEditing ? (
					<button className="save-btn" onClick={onSaveEdit}>
						Save
					</button>
				) : (
					<button className="edit-btn" onClick={onEditClick}>
						Edit
					</button>
				)}
				<button
					className="delete-btn"
					onClick={() => onDelete(application._id)}
				>
					Delete
				</button>
			</div>
		</div>
	);
};

export default JobApplicationCard;
