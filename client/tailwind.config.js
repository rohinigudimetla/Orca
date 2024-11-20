/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			colors: {
				primary: "#4caf50",
				secondary: "#2196f3",
				warning: "#ff9800",
				danger: "#f44336",
			},
		},
	},
	plugins: [],
};
