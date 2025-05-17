import axios from "axios";

const api = axios.create({
  // baseURL: "http://localhost:3000",
  baseURL: "https://fair-share-server.onrender.com",
  withCredentials: true,
});

export default api;
