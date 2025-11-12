import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { blogs_data } from "../assets/Assets.jsx";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();

  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [input, setInput] = useState("");

  const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
  });

  axios.defaults.withCredentials = true;

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
      toast.error(error.message);
    }
  };

  const getAuthState = async () => {
    try {
      const { data } = await axiosInstance.get("/api/auth/is-auth");
      if (data.success) {
        setIsLoggedin(true);
        getUserData();
      } else {
        setIsLoggedin(false);
      }
    } catch (error) {
      toast.error("Auth check failed!");
    }
  };

  const getUserData = async () => {
    try {
      const { data } = await axiosInstance.get("/api/user/data");
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

  const handleLoginSuccess = () => {
    setIsLoggedin(true);
    getUserData();
    toast.success("Login successful!");
    navigate("/admin");
  };

  const handleLogout = async () => {
    try {
      setIsLoggedin(false);
      setUserData(null);
      setCurrentUserId(null);
      toast.success("Logged out successfully!");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed!");
    }
  };

  // Helper: Check if user is admin
  const isAdmin = userData?.role === 'admin';

  // Helper: Check if user can edit a blog
  const canEdit = (blog) => {
    if (!userData) return false;
    if (userData.role === 'admin') return true;
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
    canEdit
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