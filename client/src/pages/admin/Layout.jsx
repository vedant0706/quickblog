import React from "react";
import { assets } from "../../assets/Assets.jsx";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import { useAppContext } from "../../context/AppContext";
import { IoMdLogOut } from "react-icons/io";
import { toast } from "react-toastify";

const Layout = () => {
  const navigate = useNavigate();
  const { backendUrl, setUserData, setIsLoggedin, axios } = useAppContext();

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(`${backendUrl}/api/auth/logout`);

      if (data.success) {
        setIsLoggedin(false);
        setUserData(null);
        toast.success("Logged out successfully");
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between py-2 h-[70px] px-4 sm:px-12 border-b border-gray-200">
        <div className="flex flex-row items-center justify-center">
          <img
            onClick={() => navigate("/")}
            src={assets.gemini_logo}
            alt="logo"
            className="w-8 h-8 sm:w-8 cursor-pointer"
          />
          <img
            onClick={() => navigate("/")}
            src={assets.main_logo}
            alt="logo"
            className="w-4 sm:w-30 cursor-pointer"
          />
        </div>
        <button
          onClick={logout}
          className="flex items-center justify-center gap-2 text-md px-6 py-2 bg-[#3F72AF] text-black rounded-full cursor-pointer"
        >
          Logout
          <span className="text-xl">
            <IoMdLogOut />
          </span>
        </button>
      </div>
      <div className="flex h-[calc(100vh-70px)]">
        <Sidebar />
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
