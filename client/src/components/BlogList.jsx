import React, { useState } from "react";
import {blogCategories, blogs_data} from '../assets/Assets.jsx';
import { motion } from "motion/react";
import BlogCard from "./BlogCard.jsx";
import { useAppContext } from "../context/AppContext";

const BlogList = () => {
  const [menu, setMenu] = useState("All");
  const { blogs, input } = useAppContext();

  const filteredBlogs = () => {
    if (input === " ") {
      return blogs;
    }
    return blogs.filter(
      (blog) =>
        blog.title.toLowerCase().includes(input.toLowerCase()) ||
        blog.category.toLowerCase().includes(input.toLowerCase())
    );
  };

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2 sm:gap-4 my-6 sm:my-10 relative">
        {blogCategories.map((item) => (
          <div key={item} className="relative">
            <button
              onClick={() => setMenu(item)}
              className={`relative z-10 cursor-pointer font-medium transition-colors 
          px-3 sm:px-4 py-2 sm:py-1.5 rounded-full 
          text-sm sm:text-base
          ${
            menu === item
              ? "text-black bg-[#3F72AF]"
              : "text-zinc-900 hover:text-[#3F72AF]"
          }`}
            >
              {item}
            </button>

            {menu === item && (
              <motion.div
                layoutId="underline"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="absolute inset-0 z-0 rounded-full bg-primary"
              ></motion.div>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 mb-24 mx-8 sm:mx-16 xl:mx-40">
        {filteredBlogs()
          .filter((blog) => (menu === "All" ? true : blog.category === menu))
          .map((blog) => (
            <BlogCard key={blog._id} blogs={blog} />
          ))}
      </div>
    </div>
  );
};

export default BlogList;