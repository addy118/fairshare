import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  // baseURL: "https://fairshare.api.adityakirti.tech",
  withCredentials: true,
});

export default api;
