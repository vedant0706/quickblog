// import { createContext, useContext, useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { blogs_data } from "../assets/Assets.jsx";

// const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
// console.log("Backend URL:", BASE_URL);

// export const AppContext = createContext();

// export const AppProvider = ({ children }) => {
//   const navigate = useNavigate();

//   const [isLoggedin, setIsLoggedin] = useState(false);
//   const [userData, setUserData] = useState(null);
//   const [currentUserId, setCurrentUserId] = useState(null);
//   const [blogs, setBlogs] = useState([]);
//   const [input, setInput] = useState("");

//   const axiosInstance = axios.create({
//     baseURL: BASE_URL,
//     withCredentials: true,
//   });

//   axios.defaults.withCredentials = true;

//   const fetchBlogs = async () => {
//     try {
//       const { data } = await axiosInstance.get("/api/blog/all");
//       if (data.success && data.blogs && data.blogs.length > 0) {
//         setBlogs(data.blogs);
//       } else {
//         setBlogs(blogs_data);
//       }
//     } catch (error) {
//       setBlogs(blogs_data);
//       toast.error(error.message);
//     }
//   };

//   const getAuthState = async () => {
//     try {
//       const { data } = await axiosInstance.get("/api/auth/is-auth");
//       if (data.success) {
//         setIsLoggedin(true);
//         getUserData();
//       } else {
//         setIsLoggedin(false);
//       }
//     } catch (error) {
//       toast.error("Auth check failed!");
//     }
//   };

//   const getUserData = async () => {
//     try {
//       const { data } = await axiosInstance.get("/api/user/data");
//       if (data.success) {
//         setUserData(data.userData);
//         setCurrentUserId(data.userData._id);
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   const handleLoginSuccess = () => {
//     setIsLoggedin(true);
//     getUserData();
//     toast.success("Login successful!");
//     navigate("/admin");
//   };

//   const handleLogout = async () => {
//     try {
//       setIsLoggedin(false);
//       setUserData(null);
//       setCurrentUserId(null);
//       toast.success("Logged out successfully!");
//       navigate("/login");
//     } catch (error) {
//       toast.error("Logout failed!");
//     }
//   };

//   // Helper: Check if user is admin
//   const isAdmin = userData?.role === 'admin';

//   // Helper: Check if user can edit a blog
//   const canEdit = (blog) => {
//     if (!userData) return false;
//     if (userData.role === 'admin') return true;
//     return blog.authorId?._id === userData._id;
//   };

//   useEffect(() => {
//     getAuthState();
//     fetchBlogs();
//   }, []);

//   const value = {
//     backendUrl: BASE_URL,
//     axios: axiosInstance,
//     isLoggedin,
//     setIsLoggedin,
//     userData,
//     setUserData,
//     getUserData,
//     currentUserId,
//     blogs,
//     setBlogs,
//     fetchBlogs,
//     input,
//     setInput,
//     getAuthState,
//     handleLoginSuccess,
//     handleLogout,
//     isAdmin,
//     canEdit
//   };

//   return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
// };

// export const useAppContext = () => {
//   const context = useContext(AppContext);
//   if (!context) {
//     throw new Error("useAppContext must be used within AppProvider");
//   }
//   return context;
// };

// export default AppContext;


// ========================================================================================
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { blogs_data } from "../assets/Assets.jsx";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

console.log('🔗 Backend URL:', BASE_URL);
console.log('🌍 Mode:', import.meta.env.MODE);

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();

  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ Create axios instance with credentials
  const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  // ✅ Set global default
  axios.defaults.withCredentials = true;

  // ✅ Request interceptor for debugging
  axiosInstance.interceptors.request.use(
    (config) => {
      console.log('📤 Request:', config.method?.toUpperCase(), config.url);
      return config;
    },
    (error) => {
      console.error('📤 Request Error:', error);
      return Promise.reject(error);
    }
  );

  // ✅ Response interceptor for debugging
  axiosInstance.interceptors.response.use(
    (response) => {
      console.log('📥 Response:', response.config.url, response.status);
      return response;
    },
    (error) => {
      console.error('📥 Response Error:', error.response?.status, error.message);
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
      console.error('❌ Fetch blogs error:', error);
      setBlogs(blogs_data);
    }
  };

  const getAuthState = async () => {
    try {
      console.log('🔍 Checking auth state...');
      const { data } = await axiosInstance.get("/api/auth/is-auth", { withCredentials: true });
      console.log('🔍 Auth response:', data);
      
      if (data.success) {
        console.log('✅ User is authenticated');
        setIsLoggedin(true);
        await getUserData();
      } else {
        console.log('❌ User not authenticated');
        setIsLoggedin(false);
      }
    } catch (error) {
      console.error('❌ Auth check failed:', error.response?.data || error.message);
      setIsLoggedin(false);
    } finally {
      setLoading(false);
    }
  };

  const getUserData = async () => {
    try {
      console.log('👤 Fetching user data...');
      const { data } = await axiosInstance.get("/api/user/data", { withCredentials: true });
      
      if (data.success) {
        console.log('✅ User data received:', data.userData.email);
        setUserData(data.userData);
        setCurrentUserId(data.userData._id);
      } else {
        console.log('❌ Failed to get user data:', data.message);
        toast.error(data.message);
      }
    } catch (error) {
      console.error('❌ Get user data error:', error);
      toast.error(error.message);
    }
  };

  // ✅ CRITICAL FIX: Wait for cookie to propagate before checking auth
  const handleLoginSuccess = async () => {
    console.log('🎉 Login successful, waiting for cookie...');
    
    // Wait for cookie to be set properly
    await new Promise(resolve => setTimeout(resolve, 200));
    
    console.log('🔄 Fetching auth state...');
    await getAuthState();
    
    toast.success("Login successful!");
    navigate("/admin");
  };

  const handleLogout = async () => {
    try {
      console.log('🚪 Logging out...');
      
      // ✅ Call logout endpoint to clear cookie
      await axiosInstance.post("/api/auth/logout");
      
      setIsLoggedin(false);
      setUserData(null);
      setCurrentUserId(null);
      
      toast.success("Logged out successfully!");
      navigate("/login");
      
      console.log('✅ Logout complete');
    } catch (error) {
      console.error('❌ Logout error:', error);
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

  // ✅ Check auth on mount
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
    loading
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