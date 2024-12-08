import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import OrcaLogo from "./icons/OrcaLogo";

const Navbar = () => {
	const { user, logout } = useAuth();
	const navigate = useNavigate();

	const handleLogout = () => {
		logout();
		navigate("/login");
	};

	return (
		<nav className="bg-richBlack shadow-md">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-16">
					<div className="flex items-center">
						<OrcaLogo />
						{/* <h1 className="text-xl font-bold text-bone">
							Job Application Tracker
						</h1> */}
					</div>
					<div className="flex items-center gap-4">
						<span className="text-bone hidden sm:block">
							{user?.user?.name}
						</span>
						<img
							src={user?.user?.picture}
							alt="Profile"
							className="w-8 h-8 rounded-full"
						/>
						<button
							onClick={handleLogout}
							className="px-4 py-2 sm:px-4 sm:py-2 bg-seaGreen text-white rounded-full hover:bg-seaGreen/90 transition-colors"
						>
							Log Out
						</button>
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
