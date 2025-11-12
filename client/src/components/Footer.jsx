import React from "react";
import { assets } from "../assets/Assets.jsx";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 border border-t">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row items-start justify-between gap-10 py-10 text-zinc-900">
        {/* Left Content */}
        <div>
          <div className="flex items-center justify-start">
            <img
              src={assets.gemini_logo}
              alt="logo"
              className="w-8 h-8 sm:w-8 cursor-pointer"
            />
            <img
              src={assets.main_logo}
              alt="logo"
              className="w-4 sm:w-30 cursor-pointer"
            />
          </div>
          <p className="max-w-[410px] mt-6">
            Welcome to our blog – a space where ideas, stories, and knowledge
            come together. We share insightful articles, helpful guides, and
            thought-provoking content to keep you informed and inspired. Whether
            you’re here to learn something new, stay updated with trends, or
            simply enjoy good reads, our blog is designed for curious minds like
            yours.
          </p>
        </div>

        {/* Right Columns Section */}
        <div className="w-full md:w-[55%]">
          <div className="flex flex-col md:flex-row justify-between gap-12 text-center md:text-left">
            {/* General Section */}
            <ul className="flex flex-col gap-2">
              <li className="text-zinc-900 font-bold text-lg font-mono mb-2 border-b-2 border-[#540863] inline-block">
                General
              </li>
              <Link
                to="/"
                className="text-zinc-700 hover:text-[#540863] hover:underline hover:translate-x-1 transition-all duration-300 font-medium"
              >
                Home
              </Link>
              <Link
                to="/"
                className="text-zinc-700 hover:text-[#540863] hover:underline hover:translate-x-1 transition-all duration-300 font-medium"
              >
                Best Sellers
              </Link>
              <Link
                to="/"
                className="text-zinc-700 hover:text-[#540863] hover:underline hover:translate-x-1 transition-all duration-300 font-medium"
              >
                Offers & Deals
              </Link>
              <Link
                to="/"
                className="text-zinc-700 hover:text-[#540863] hover:underline hover:translate-x-1 transition-all duration-300 font-medium"
              >
                Contact Us
              </Link>
              <Link
                to="/"
                className="text-zinc-700 hover:text-[#540863] hover:underline hover:translate-x-1 transition-all duration-300 font-medium"
              >
                FAQs
              </Link>
            </ul>

            {/* Need Help Section */}
            <ul className="flex flex-col gap-2">
              <li className="text-gray-900 font-bold text-lg font-mono mb-2 border-b-2 border-[#540863] inline-block">
                Need Help?
              </li>
              <Link
                to="/"
                className="text-zinc-700 hover:text-[#540863] hover:underline hover:translate-x-1 transition-all duration-300 font-medium"
              >
                Delivery Information
              </Link>
              <Link
                to="/"
                className="text-zinc-700 hover:text-[#540863] hover:underline hover:translate-x-1 transition-all duration-300 font-medium"
              >
                Return & Refund Policy
              </Link>
              <Link
                to="/"
                className="text-zinc-700 hover:text-[#540863] hover:underline hover:translate-x-1 transition-all duration-300 font-medium"
              >
                Payment Methods
              </Link>
              <Link
                to="/"
                className="text-zinc-700 hover:text-[#540863] hover:underline hover:translate-x-1 transition-all duration-300 font-medium"
              >
                Track Your Order
              </Link>
              <Link
                to="/"
                className="text-zinc-700 hover:text-[#540863] hover:underline hover:translate-x-1 transition-all duration-300 font-medium"
              >
                Contact Us
              </Link>
            </ul>

            {/* Follow Us Section */}
            <ul className="flex flex-col gap-2">
              <li className="text-gray-900 font-bold text-lg font-mono mb-2 border-b-2 border-[#540863] inline-block">
                Follow Us
              </li>
              <Link
                to="/"
                className="text-zinc-700 hover:text-[#540863] hover:underline hover:translate-x-1 transition-all duration-300 font-medium"
              >
                Instagram
              </Link>
              <Link
                to="/"
                className="text-zinc-700 hover:text-[#540863] hover:underline hover:translate-x-1 transition-all duration-300 font-medium"
              >
                Twitter
              </Link>
              <Link
                to="/"
                className="text-zinc-700 hover:text-[#540863] hover:underline hover:translate-x-1 transition-all duration-300 font-medium"
              >
                Facebook
              </Link>
              <Link
                to="/"
                className="text-zinc-700 hover:text-[#540863] hover:underline hover:translate-x-1 transition-all duration-300 font-medium"
              >
                YouTube
              </Link>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex border-t items-center justify-between py-4 text-center text-sm md:text-base text-zinc-900">
        <p className="pt-1">
          © {new Date().getFullYear()} Gem AI - All Rights Reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;