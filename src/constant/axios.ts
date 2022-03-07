import axios from "axios";
import { baseURL } from "./parameter";
const api = axios.create({
    baseURL: baseURL,
    withCredentials: true
});

export default api;