import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  // baseURL: "http://localhost:3000",
  // baseURL: "https://fairshare.api.adityakirti.tech",
  withCredentials: true,
});

export default api;
