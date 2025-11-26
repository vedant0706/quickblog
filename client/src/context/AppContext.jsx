import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { blogs_data } from "../assets/Assets.jsx";

const BASE_URL =
  import.meta.env.MODE === "production"
    ? ""
    : import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();

  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);

  // Create axios instance with credentials
  const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });

  axios.defaults.withCredentials = true;

  axiosInstance.interceptors.request.use(
    (config) => {
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const fetchBlogs = async () => {
    try {
      const { data } = await axiosInstance.get("/api/blog/all");
      if (data.success && data.blogs && data.blogs.length > 0) {
        setBlogs(data.blogs);
      } else {
        setBlogs(blogs_data);
      }
    } catch (error) {
      setBlogs(blogs_data);
    }
  };

  const getAuthState = async () => {
    try {
      const { data } = await axiosInstance.get("/api/auth/is-auth", {
        withCredentials: true,
      });

      if (data.success) {
        setIsLoggedin(true);
        await getUserData();
      } else {
        setIsLoggedin(false);
      }
    } catch (error) {
      setIsLoggedin(false);
    } finally {
      setLoading(false);
    }
  };

  const getUserData = async () => {
    try {
      const { data } = await axiosInstance.get("/api/user/data", {
        withCredentials: true,
      });

      if (data.success) {
        setUserData(data.userData);
        setCurrentUserId(data.userData._id);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleLoginSuccess = async () => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    await getAuthState();

    toast.success("Login successful!");
    navigate("/admin");
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/api/auth/logout");

      setIsLoggedin(false);
      setUserData(null);
      setCurrentUserId(null);

      toast.success("Logged out successfully!");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed!");
    }
  };

  const isAdmin = userData?.role === "admin";

  const canEdit = (blog) => {
    if (!userData) return false;
    if (userData.role === "admin") return true;
    return blog.authorId?._id === userData._id;
  };

  useEffect(() => {
    getAuthState();
    fetchBlogs();
  }, []);

  const value = {
    backendUrl: BASE_URL,
    axios: axiosInstance,
    isLoggedin,
    setIsLoggedin,
    userData,
    setUserData,
    getUserData,
    currentUserId,
    blogs,
    setBlogs,
    fetchBlogs,
    input,
    setInput,
    getAuthState,
    handleLoginSuccess,
    handleLogout,
    isAdmin,
    canEdit,
    loading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
};

export default AppContext;
