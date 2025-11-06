import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { blogs_data } from "../assets/Assets.jsx";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

// Create the context
export const AppContext = createContext();

// Provider component
export const AppProvider = ({ children }) => {
  const navigate = useNavigate();

  // State variables
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null); // Add current user ID
  const [blogs, setBlogs] = useState([]);
  const [input, setInput] = useState("");

  // Create axios instance with default config
  const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
  });

  // Also set global axios defaults
  axios.defaults.withCredentials = true;

  // Fetch all blogs
  const fetchBlogs = async () => {
    try {
      const { data } = await axiosInstance.get("/api/blog/all");
      if (data.success && data.blogs && data.blogs.length > 0) {
        setBlogs(data.blogs);
      } else {
        setBlogs(blogs_data)
        // toast.error(data.message);
      }
    } catch (error) {
      setBlogs(blogs_data)
      toast.error(error.message);
      console.log("using local blog data")
    }
  };

  // Check authentication state
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
      console.log(error);
      toast.error("Auth check failed!");
    }
  };

  // Get user data
  const getUserData = async () => {
    try {
      const { data } = await axiosInstance.get("/api/user/data");
      if (data.success) {
        setUserData(data.userData);
        setCurrentUserId(data.userData._id); // Set current user ID
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Handle login success
  const handleLoginSuccess = () => {
    setIsLoggedin(true);
    getUserData();
    toast.success("Login successful!");
    navigate("/admin");
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      // Optional: Call logout endpoint if you have one
      // await axiosInstance.post("/api/auth/logout");
      
      setIsLoggedin(false);
      setUserData(null);
      setCurrentUserId(null); // Clear user ID on logout
      toast.success("Logged out successfully!");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed!");
    }
  };

  // Initialize on mount
  useEffect(() => {
    getAuthState();
    fetchBlogs();
  }, []);

  // Context value
  const value = {
    // Backend URL
    backendUrl: BASE_URL,
    
    // Axios instance
    axios: axiosInstance,
    
    // Auth state
    isLoggedin,
    setIsLoggedin,
    
    // User data
    userData,
    setUserData,
    getUserData,
    currentUserId, // Export current user ID
    
    // Blogs
    blogs,
    setBlogs,
    fetchBlogs,
    
    // Input state (if needed for search/filter)
    input,
    setInput,
    
    // Auth methods
    getAuthState,
    handleLoginSuccess,
    handleLogout,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook for using the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
};

// Export default for backward compatibility
export default AppContext;