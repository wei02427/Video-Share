import axios from "axios";

const api = axios.create({
    baseURL: process.env.NODE_ENV === 'production' ? "https://videoshareapi.hopto.org" : "http://localhost:3000",
    withCredentials: true
});

export default api;