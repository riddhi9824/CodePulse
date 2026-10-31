import axios from "axios";

const api = axios.create({
    baseURL: "http://127.0.0.1:8000",
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
    },
});

export const analyzeCode = async(code) => {
    const response = await api.post("/api/analyze", { code });
    return response.data;
};

export const checkBackendHealth = async() => {
    const response = await api.get("/health");
    return response.data;
};

export default api;