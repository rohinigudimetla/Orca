import jwt from "jsonwebtoken";

export const auth = async (req, res, next) => {
	res.header("Access-Control-Allow-Origin", "http://localhost:5173"); // Your frontend URL
	res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
	res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

	try {
		const token = req.headers.authorization?.split(" ")[1];

		if (!token) {
			return res.status(401).json({ message: "Authentication required" });
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.userId = decoded.id;
		next();
	} catch (error) {
		res.status(401).json({ message: "Invalid token" });
	}
};
