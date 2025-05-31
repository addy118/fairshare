import { useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import api from "./axiosInstance";

export default function AxiosInterceptor() {
  const { getToken, isSignedIn } = useAuth();

  useEffect(() => {
    if (!isSignedIn) return;

    const interceptor = api.interceptors.request.use(async (config) => {
      const token = await getToken();
      console.log("from interceptor");
      console.log(token);

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    return () => api.interceptors.request.eject(interceptor);
  }, [isSignedIn]);
}
