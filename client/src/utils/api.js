import { useAuth } from "../context/AuthContext";

const BASE_URL = "http://localhost:5000/api";

export const createApiClient = (user) => {
	const headers = {
		"Content-Type": "application/json",
		Authorization: `Bearer ${user.token}`,
	};

	return {
		get: async (endpoint) => {
			const response = await fetch(`${BASE_URL}${endpoint}`, { headers });
			return handleResponse(response);
		},

		post: async (endpoint, data) => {
			const response = await fetch(`${BASE_URL}${endpoint}`, {
				method: "POST",
				headers,
				body: JSON.stringify(data),
			});
			return handleResponse(response);
		},

		put: async (endpoint, data) => {
			const response = await fetch(`${BASE_URL}${endpoint}`, {
				method: "PUT",
				headers,
				body: JSON.stringify(data),
			});
			return handleResponse(response);
		},

		delete: async (endpoint) => {
			const response = await fetch(`${BASE_URL}${endpoint}`, {
				method: "DELETE",
				headers,
			});
			return handleResponse(response);
		},

		upload: async (endpoint, formData) => {
			const response = await fetch(`${BASE_URL}${endpoint}`, {
				method: "POST",
				headers: {
					Authorization: headers.Authorization,
				},
				body: formData,
			});
			return handleResponse(response);
		},

		download: async (endpoint, filename) => {
			const response = await fetch(`${BASE_URL}${endpoint}`, {
				headers,
			});

			if (!response.ok) {
				throw new Error("Download failed");
			}

			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = filename;
			document.body.appendChild(a);
			a.click();
			window.URL.revokeObjectURL(url);
			a.remove();
		},
	};
};

const handleResponse = async (response) => {
	if (response.status === 401) {
		// Handle token expiration
		localStorage.removeItem("user");
		window.location.href = "/login";
		throw new Error("Session expired");
	}

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message);
	}

	return response.json();
};
