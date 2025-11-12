import React, { useState, useEffect } from "react";
import {blogCategories} from '../assets/Assets.jsx';
import { motion } from "motion/react";
import BlogCard from "./BlogCard.jsx";
import { useAppContext } from "../context/AppContext";

const BlogList = () => {
  const [menu, setMenu] = useState("All");
  const { blogs, input, axios, isLoggedin } = useAppContext();
  const [publicBlogs, setPublicBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch public blogs (published & approved) for homepage
  const fetchPublicBlogs = async () => {
    try {
      setLoading(true);
      // Use public endpoint that doesn't require authentication
      const { data } = await axios.get('/api/blog/public/all');
      
      if (data.success) {
        setPublicBlogs(data.blogs);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicBlogs();
  }, []);

  // Determine which blogs to show
  const displayBlogs = publicBlogs.length > 0 ? publicBlogs : blogs;

  const filteredBlogs = () => {
    if (!input || input === " ") {
      return displayBlogs;
    }
    return displayBlogs.filter(
      (blog) =>
        blog.title.toLowerCase().includes(input.toLowerCase()) ||
        blog.category.toLowerCase().includes(input.toLowerCase())
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-[#3F72AF] border-gray-200"></div>
      </div>
    );
  }

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
              ? "text-white bg-[#540863]"
              : "text-zinc-900 hover:text-[#540863]"
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

      {filteredBlogs().length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-800 text-xl">
            No blogs found. {isLoggedin ? "Create your first blog to get started!" : "Be the first to share your thoughts!"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 mb-24 mx-8 sm:mx-16 xl:mx-40">
          {filteredBlogs()
            .filter((blog) => (menu === "All" ? true : blog.category === menu))
            .map((blog) => (
              <BlogCard key={blog._id} blogs={blog} />
            ))}
        </div>
      )}
    </div>
  );
};

export default BlogList;