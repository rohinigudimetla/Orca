import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const Login = () => {
	const { login } = useAuth();
	const navigate = useNavigate();

	const handleSuccess = async (credentialResponse) => {
		const decoded = jwtDecode(credentialResponse.credential);

		try {
			const response = await fetch("http://localhost:5000/api/auth/google", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ credential: credentialResponse.credential }),
			});

			const data = await response.json();
			login(data);
			navigate("/");
		} catch (error) {
			console.error("Authentication failed:", error);
		}
	};

	return (
		<div className="min-h-screen bg-richBlack flex items-center justify-center">
			<div className="bg-bone p-8 rounded-lg shadow-xl">
				<h1 className="text-2xl font-bold text-richBlack mb-6 text-center">
					Job Application Tracker
				</h1>
				<GoogleLogin
					onSuccess={handleSuccess}
					onError={() => console.log("Login Failed")}
				/>
			</div>
		</div>
	);
};

export default Login;
