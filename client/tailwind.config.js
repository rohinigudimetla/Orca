/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			colors: {
				richBlack: "#0D1F22",
				celadon: "#AEF6C7",
				orange: "#CC0000",
				seaGreen: "#0A8754",
				bone: "#f7f7f3",
				cerulean: "#007991",
			},
			keyframes: {
				"slide-up": {
					"0%": { transform: "translateY(100%)" },
					"100%": { transform: "translateY(0)" },
				},
			},
			animation: {
				"slide-up": "slide-up 0.3s ease-out",
			},
		},
	},
	plugins: [],
};
