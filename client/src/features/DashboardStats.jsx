import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { createApiClient } from "../utils/api";
import StatCard from "../components/StatCard";

// Create the DashboardStats feature component
const DashboardStats = () => {
	// Set up authentication and API client
	const { user } = useAuth();
	const api = createApiClient(user);

	// Initialize state for statistics
	const [stats, setStats] = useState({
		totalApplications: 0,
		activeApplications: 0,
		interviewRate: 0,
		offerRate: 0,
	});

	// Fetch dashboard statistics on component mount
	useEffect(() => {
		const fetchStats = async () => {
			try {
				const data = await api.get("/job-applications/stats");
				setStats(data);
			} catch (error) {
				console.error("Error fetching dashboard stats:", error);
			}
		};

		fetchStats();
	}, [api]);

	// Render the dashboard statistics
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
			{/* Display various statistics using the StatCard component */}
			<StatCard
				title="Total Applications"
				value={stats.totalApplications}
				icon="📝"
			/>
			<StatCard
				title="Active Applications"
				value={stats.activeApplications}
				icon="🎯"
			/>
			<StatCard
				title="Interview Rate"
				value={`${stats.interviewRate}%`}
				icon="📈"
			/>
			<StatCard title="Offer Rate" value={`${stats.offerRate}%`} icon="🎉" />
		</div>
	);
};

// Export the component
export default DashboardStats;
