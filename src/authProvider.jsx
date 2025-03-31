import React, {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";

import api from "./axiosInstance";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("useAuth must be used within a AuthProvider");
  }

  return authContext;
};

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState();
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const [signupErrors, setSignupErrors] = useState({});
  const [loginErrors, setLoginErrors] = useState({});

  // token check in state
  // useEffect(() => {
  //   console.log("Updated Token in State:", token);
  // }, [token]);

  // set the token info to state
  // executes only once at mount
  useEffect(() => {
    const fetchMe = async () => {
      try {
        // checks for token in header and decodes token
        const response = await api.get("/auth/token");
        setToken(response.data.accessToken);
        setUser(response.data.user);
      } catch {
        // console.log("from fetchMe catch block");
        // console.log("No token found in req headers");
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

  // attach the token to all the subsequent req from client
  // executes whenever the token changes
  useLayoutEffect(() => {
    const authInterceptor = api.interceptors.request.use((config) => {
      config.headers.Authorization =
        !config._retry && token
          ? `Bearer ${token}`
          : config.headers.Authorization;

      return config;
    });

    return () => {
      api.interceptors.request.eject(authInterceptor);
    };
  }, [token]);

  // page refreshes or access token expires
  useLayoutEffect(() => {
    const refreshInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (
          error.response.status == 403 &&
          error.response.data.msg == "Invalid or expired token"
        ) {
          try {
            console.log("Refreshing the token...");
            const response = await api.get("/auth/refresh");
            setToken(response.data.accessToken);
            // setUser(response.data.decoded);

            originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
            originalRequest._retry = true;

            return api(originalRequest);
          } catch {
            console.log("Token refresh failed. Redirecting to login...");
            setToken(null);
            navigate("/", { replace: true });
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(refreshInterceptor);
    };
  }, [navigate]);

  // credentials = { name, username, email, password }
  const signup = async (credentials) => {
    try {
      setSignupErrors({});
      await api.post("auth/signup", credentials);
      alert("User created successfully!");
      navigate("/login");
    } catch (err) {
      if (err.response && err.response.data.error) {
        const serverErrors = {};
        err.response.data.error.forEach((error) => {
          if (!serverErrors[error.path]) {
            serverErrors[error.path] = [];
          }
          serverErrors[error.path].push(error.msg);
        });
        setSignupErrors(serverErrors);
      }
    }
  };

  // credentials = { data, password }
  const login = async (credentials) => {
    try {
      const response = await api.post("auth/login", credentials);
      setToken(response.data.accessToken);
      setUser(response.data.user);

      const from = location.state?.from?.pathname || "/home";
      navigate(from, { replace: true });
    } catch (err) {
      // console.log(err.response);
      if (err.response && err.response.data.error) {
        const serverErrors = {};
        err.response.data.error.forEach((error) => {
          if (!serverErrors[error.path]) {
            serverErrors[error.path] = [];
          }
          serverErrors[error.path].push(error.msg);
        });
        setLoginErrors(serverErrors);
        // console.log(serverErrors);
      }
    }
  };

  const logout = async () => {
    await api.post("auth/logout");
    setToken(null);
    navigate("/");
  };

  const contextValue = {
    token,
    user,
    loading,
    isAuth: !!token,
    signup,
    signupErrors,
    login,
    loginErrors,
    logout,
    setToken,
    setUser,
    setLoading,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
