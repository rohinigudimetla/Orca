// Import React
import React from "react";

// Create the reusable StatCard component
const StatCard = ({ title, value, icon }) => {
	return (
		<div className="bg-white p-6 rounded-lg shadow-md">
			{/* Card header with icon */}
			<div className="flex items-center mb-4">
				<span className="text-2xl mr-2">{icon}</span>
				<h3 className="text-lg font-semibold text-richBlack">{title}</h3>
			</div>

			{/* Card value */}
			<p className="text-3xl font-bold text-seaGreen">{value}</p>
		</div>
	);
};

// Export the component
export default StatCard;
