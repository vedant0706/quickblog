import React from "react";
import {assets} from '../assets/Assets.jsx';
// import { useNavigate } from 'react-router-dom'
import { useAppContext } from "../context/AppContext";

const Navbar = () => {
  const { navigate, token } = useAppContext();

  return (
    <div>
      <div className="flex justify-between items-center py-5 mx-8 sm:mx-20 xl:mx-32">
        {/* Logo (left) */}
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
        {/* Right Side (Dashboard + Toggle) */}
        <div className="flex items-center gap-4 ml-auto">
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center gap-2 rounded-full text-sm cursor-pointer bg-primary text-white px-10 py-2.5"
          >
            {token ? "Dashboard" : "Login"}
            <img src={assets.arrow} alt="arrow" className="w-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
