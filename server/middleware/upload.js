import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Fix for __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the uploads folder exists
const uploadsFolder = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadsFolder)) {
	fs.mkdirSync(uploadsFolder);
	console.log("Uploads folder created.");
}

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, uploadsFolder);
	},
	filename: (req, file, cb) => {
		cb(null, `${Date.now()}_${file.originalname}`);
	},
});

const upload = multer({
	storage: storage,
	fileFilter: (req, file, cb) => {
		const fileTypes = /pdf/; // Only allow PDFs
		const extname = fileTypes.test(
			path.extname(file.originalname).toLowerCase()
		);
		if (extname) {
			return cb(null, true);
		} else {
			cb(new Error("Error: PDF files only!"));
		}
	},
});

export default upload;
