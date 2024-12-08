// Import necessary dependencies
import React from "react";
import Navbar from "../components/Navbar";
import DashboardStats from "../features/DashboardStats";

// Create the main Dashboard page component
const DashboardPage = () => {
	return (
		<div>
			{/* Include the Navbar component that's shared across pages */}
			<Navbar />

			{/* Main dashboard content container */}
			<div className="sm:m-5">
				{/* Add the dashboard statistics feature component */}
				<DashboardStats />
			</div>
		</div>
	);
};

// Export the component
export default DashboardPage;
