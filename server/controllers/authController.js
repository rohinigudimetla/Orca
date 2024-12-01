import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {
	try {
		const { credential } = req.body;
		const ticket = await client.verifyIdToken({
			idToken: credential,
			audience: process.env.GOOGLE_CLIENT_ID,
		});

		const { sub: googleId, email, name, picture } = ticket.getPayload();

		let user = await User.findOne({ googleId });

		if (!user) {
			user = await User.create({
				googleId,
				email,
				name,
				picture,
			});
		}

		const token = jwt.sign(
			{ id: user._id, email: user.email },
			process.env.JWT_SECRET,
			{ expiresIn: "24h" }
		);

		res.status(200).json({
			token,
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				picture: user.picture,
			},
		});
	} catch (error) {
		res.status(500).json({ message: "Authentication failed" });
	}
};
