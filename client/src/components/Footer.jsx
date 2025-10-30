import React from "react";
import { assets, footer_data } from "../assets/Assets.jsx";

const Footer = () => {
  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 bg-white">
      <div className="flex flex-col md:flex-row items-start justify-between gap-10 py-10 border-b border-gray-500/30 text-gray-500">
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

        <div className="flex flex-wrap justify-between w-full md:w-[45%] gap-5">
          {footer_data.map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold text-base text-gray-900 md:mb-5 mb-2">
                {section.title}
              </h3>
              <ul className="text-sm space-y-1">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline transition"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between py-4 text-center text-sm md:text-base text-gray-500/80">
        <p className="pt-1">
          Copyright 2025 &copy; Gem AI - All Right Reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
