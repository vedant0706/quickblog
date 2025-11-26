import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import BlogTableItem from "../../components/admin/BlogTableItem";

const ListBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [filter, setFilter] = useState("all");
  const { axios, userData } = useAppContext();

  const fetchBlogs = async () => {
    try {
      const endpoint =
        userData?.role === "admin" ? "/api/admin/blogs" : "/api/blog/my-blogs";

      const { data } = await axios.get(endpoint);

      if (data.success) {
        const blogsWithDefaults = (data.blogs || []).map((blog) => ({
          ...blog,
          isPublished: blog.isPublished ?? false,
          isApproved: blog.isApproved ?? false,
        }));
        setBlogs(blogsWithDefaults);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (userData) {
      fetchBlogs();
    }
  }, [userData]);

  const getFilteredBlogs = () => {
    if (!Array.isArray(blogs)) return [];

    switch (filter) {
      case "published":
        return blogs.filter(
          (blog) =>
            blog && blog.isPublished === true && blog.isApproved === true
        );
      case "draft":
        return blogs.filter((blog) => blog && blog.isPublished === false);
      case "pending":
        return blogs.filter((blog) => blog && blog.isApproved === false);
      default:
        return blogs;
    }
  };

  const filteredBlogs = getFilteredBlogs();

  const getPublishedCount = () => {
    if (!Array.isArray(blogs)) return 0;
    return blogs.filter(
      (b) => b && b.isPublished === true && b.isApproved === true
    ).length;
  };

  const getDraftCount = () => {
    if (!Array.isArray(blogs)) return 0;
    return blogs.filter((b) => b && b.isPublished === false).length;
  };

  const getPendingCount = () => {
    if (!Array.isArray(blogs)) return 0;
    return blogs.filter((b) => b && b.isApproved === false).length;
  };

  return (
    <div className="flex-1 pt-5 px-5 sm:pt-12 sm:pl-16 bg-[#112D4E]/1">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-black">
            {userData?.role === "admin" ? "All Blogs" : "My Blogs"}
          </h1>
          {userData?.role === "admin" && (
            <p className="text-sm text-gray-600 mt-1">
              Manage all user blogs and content
            </p>
          )}
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${
              filter === "all"
                ? "bg-[#540863] text-white"
                : "bg-purple-600/50 text-black hover:bg-purple-400"
            }`}
          >
            All ({blogs.length || 0})
          </button>
          <button
            onClick={() => setFilter("published")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${
              filter === "published"
                ? "bg-green-600 text-white"
                : "bg-green-600/50 text-black hover:bg-green-300"
            }`}
          >
            Published ({getPublishedCount()})
          </button>
          <button
            onClick={() => setFilter("draft")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${
              filter === "draft"
                ? "bg-yellow-600 text-white"
                : "bg-yellow-600/50 text-black hover:bg-yellow-200"
            }`}
          >
            Drafts ({getDraftCount()})
          </button>
          {userData?.role === "admin" && (
            <button
              onClick={() => setFilter("pending")}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                filter === "pending"
                  ? "bg-orange-600 text-white"
                  : "bg-orange-600/50 text-black hover:bg-orange-300"
              }`}
            >
              Pending ({getPendingCount()})
            </button>
          )}
        </div>
      </div>

      {filteredBlogs.length === 0 ? (
        <div className="text-center py-10 text-gray-500 bg-white rounded-lg shadow">
          <p>
            {filter === "all"
              ? userData?.role === "admin"
                ? "No blogs found. Users will create blogs soon!"
                : "No blogs found. Start creating your first blog!"
              : `No ${filter} blogs found.`}
          </p>
        </div>
      ) : (
        <div className="relative h-4/5 mt-4 max-w-4xl overflow-x-auto shadow rounded-lg scrollbar-hide bg-white">
          <table className="w-full text-sm text-gray-500">
            <thead className="text-xs text-black text-left uppercase">
              <tr>
                <th scope="col" className="px-2 py-4 xl:px-6">
                  #
                </th>
                <th scope="col" className="px-2 py-4">
                  Blog Title
                </th>
                <th scope="col" className="px-2 py-4 max-sm:hidden">
                  Date
                </th>
                <th scope="col" className="px-2 py-4 max-sm:hidden">
                  Status
                </th>
                <th scope="col" className="px-2 py-4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredBlogs.map((blog, index) => (
                <BlogTableItem
                  key={blog._id || index}
                  blog={blog}
                  fetchBlogs={fetchBlogs}
                  index={index + 1}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ListBlog;
