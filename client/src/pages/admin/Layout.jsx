import React from "react";
import {assets} from '../../assets/Assets.jsx';
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import { useAppContext } from "../../context/AppContext";

const Layout = () => {
  const { axios, setToken, navigate } = useAppContext();

  const logout = () => {
    localStorage.removeItem("token");
    axios.defaults.headers.common["Authorization"] = null;
    setToken(null);
    navigate("/");
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
          className="text-sm px-8 py-2 bg-primary text-white rounded-full cursor-pointer"
        >
          Logout
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
