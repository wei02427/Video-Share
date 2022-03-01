import axios from "axios";

const api = axios.create({
    baseURL: process.env.NODE_ENV === 'production' ? "http://34.125.240.54:3000" : "http://localhost:3000",
    withCredentials: true
});

export default api;