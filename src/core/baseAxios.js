import axios from "axios";

const apiUrl = "http://127.0.0.1:8000/api/";

const baseAxios = axios.create({
    baseURL: apiUrl,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

// ===========================
//  GẮN TOKEN TỰ ĐỘNG
// ===========================
baseAxios.interceptors.request.use(
    (config) => {
        const token = window.localStorage.getItem("auth_token");
        if (token) {
            config.headers["Authorization"] = "Bearer " + token;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ===========================
//  XỬ LÝ LỖI
// ===========================
baseAxios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            window.localStorage.removeItem("auth_token");
            window.location.href = "/login";
        }

        console.error("API Error:", error);
        return Promise.reject(error);
    }
);

export default baseAxios;
