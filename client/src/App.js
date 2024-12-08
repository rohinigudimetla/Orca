// client/src/App.js
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./components/Login";
import HomePage from "./pages/HomePage";
// Import the new DashboardPage
import DashboardPage from "./pages/DashboardPage";

const ProtectedRoute = ({ children }) => {
	const { user, loading } = useAuth();

	if (loading) return <div>Loading...</div>;
	if (!user) return <Navigate to="/login" />;

	return children;
};

function App() {
	return (
		<GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
			<AuthProvider>
				<BrowserRouter>
					<Routes>
						<Route
							path="/dashboard"
							element={
								<ProtectedRoute>
									<DashboardPage />
								</ProtectedRoute>
							}
						/>
						<Route path="/login" element={<Login />} />
						<Route
							path="/"
							element={
								<ProtectedRoute>
									<HomePage />
								</ProtectedRoute>
							}
						/>
					</Routes>
				</BrowserRouter>
			</AuthProvider>
		</GoogleOAuthProvider>
	);
}

export default App;
