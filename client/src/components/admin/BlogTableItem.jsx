import React from "react";
import { assets } from "../../assets/Assets.jsx";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const BlogTableItem = ({ blog, fetchBlogs, index }) => {
  const { title, createdAt } = blog;
  const BlogDate = new Date(createdAt);

  const { axios } = useAppContext();

  const deleteBlog = async () => {
    const confirm = window.confirm(
      "Are you sure you want to delete this blog ?"
    );
    if (!confirm) return;
    try {
      const { data } = await axios.post("/api/blog/delete", { id: blog._id });
      if (data.success) {
        toast.success(data.message);
        await fetchBlogs();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  //Toggle publish
  const togglePublish = async () => {
    try {
      const { data } = await axios.post("/api/blog/toggle-publish", {
        id: blog._id,
      });

      if (data.success) {
        toast.success(data.message);
        await fetchBlogs();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Only admins can publish or unpublish blogs");
    }
  };

  return (
    <tr className="border-y border-gray-300 text-black">
      <th className="px-2 py-4">{index}</th>
      <td className="px-2 py-4">{title}</td>
      <td className="px-2 py-4 max-sm:hidden">{BlogDate.toDateString()}</td>
      <td className="px-2 py-4 text-xs gap-3 max-sm:hidden">
        <p
          className={` border px-2 py-0.5 mt-1 rounded flex text-center items-center justify-center ${
            blog.isPublished ? "text-black" : "text-black"
          }`}
        >
          {blog.isPublished ? "Publish" : "Unpublish"}
        </p>
      </td>
      <td className="px-2 py-8 flex text-xs gap-3">
        <button
          onClick={togglePublish}
          className={`border px-2 py-0.5 mt-1 rounded cursor-pointer 
            ${
              blog.isPublished
                ? "text-red-600 hover:bg-red-600/40"
                : "text-green-700 hover:bg-green-700/40"
            }`}
        >
          {blog.isPublished ? "Unpublish" : "Publish"}
        </button>
        <img
          onClick={deleteBlog}
          src={assets.bin_icon}
          className="w-5 hover:scale-110 transition-all cursor-pointer"
          alt=""
        />
      </td>
    </tr>
  );
};

export default BlogTableItem;
