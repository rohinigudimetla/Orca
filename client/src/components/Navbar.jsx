import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
	const { user, logout } = useAuth();
	const navigate = useNavigate();

	const handleLogout = () => {
		logout();
		navigate("/login");
	};

	return (
		<nav className="bg-richBlack p-4">
			<div className="container mx-auto flex justify-between items-center">
				<h1 className="text-bone text-xl font-bold">Job Application Tracker</h1>
				<div className="flex items-center gap-4">
					<span className="text-bone">{user?.user?.name}</span>
					<img
						src={user?.user?.picture}
						alt="Profile"
						className="w-8 h-8 rounded-full"
					/>
					<button
						onClick={handleLogout}
						className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
					>
						Logout
					</button>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
