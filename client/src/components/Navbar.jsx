import React from "react";
import { assets } from "../assets/Assets.jsx";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { useAppContext } from "../context/AppContext.jsx";
import { IoMdLogIn } from "react-icons/io";
import { IoDiamondSharp } from "react-icons/io5";

const Navbar = () => {
  const navigate = useNavigate();
  const { userData, backendUrl, setUserData, setIsLoggedin, isLoggedin } =
    useAppContext();

  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(
        `${backendUrl}/api/auth/send-verify-otp`
      );

      if (data.success) {
        navigate("/email-verify");
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

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
    <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0 bg-[#F9F7F7] text-[black]">
      {/* Logo Section */}
      <div
        onClick={() => navigate("/")}
        className="flex items-center gap-2 cursor-pointer font-bold"
      >
        <IoDiamondSharp className="text-3xl" />
        <p className="text-2xl">Gem AI</p>
      </div>

      {/* Conditional rendering based on Login */}
      {isLoggedin && userData ? (
        <div className="w-8 h-8 flex justify-center items-center rounded-full bg-[#540863] text-white relative group cursor-pointer">
          {userData.name?.[0]?.toUpperCase()}
          <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10">
            <ul className="list-none m-0 p-2 bg-gray-100 text-sm shadow-md rounded">
              {!userData.isAccountVerified && (
                <li
                  onClick={sendVerificationOtp}
                  className="py-1 px-2 hover:bg-gray-200 cursor-pointer"
                >
                  Verify Email
                </li>
              )}
              <li
                onClick={() => navigate("/admin/")}
                className="py-1 px-2 flex hover:bg-gray-200 cursor-pointer"
              >
                Dashboard
              </li>
              <li
                onClick={logout}
                className="py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10"
              >
                Logout
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="bg-[#540863] rounded-3xl outline-none">
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 rounded-full px-6 py-2 text-white hover:bg-[#540863] cursor-pointer"
          >
            Login
            <span className="text-2xl">
              <IoMdLogIn />
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
