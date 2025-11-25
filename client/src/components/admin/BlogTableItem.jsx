import React from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { ImCancelCircle } from "react-icons/im";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const BlogTableItem = ({ blog, fetchBlogs, index }) => {
  const {
    title = "Untitled",
    createdAt,
    author,
    authorId,
    isPublished = false,
    isApproved = false,
  } = blog || {};

  const BlogDate = createdAt ? new Date(createdAt) : new Date();
  const { axios, userData, currentUserId } = useAppContext();

  const canEdit = () => {
    if (!userData || !blog) return false;
    if (userData.role === "admin") return true;
    const blogAuthorId = authorId?._id || authorId;
    const userId = currentUserId || userData._id;
    return String(blogAuthorId) === String(userId);
  };

  const deleteBlog = async () => {
    if (!canEdit()) {
      toast.error("You do not have permission to delete this blog");
      return;
    }

    const confirm = window.confirm(
      "Are you sure you want to delete this blog?"
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
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const togglePublish = async () => {
    if (!canEdit()) {
      toast.error("You do not have permission to publish/unpublish this blog");
      return;
    }

    // ✅ Show confirmation for unpublishing
    if (isPublished) {
      const confirm = window.confirm(
        "Are you sure you want to unpublish this blog? It will no longer be visible to users."
      );
      if (!confirm) return;
    }

    try {
      console.log("🔄 Toggling publish for blog:", blog._id);

      const { data } = await axios.post("/api/blog/toggle-publish", {
        id: blog._id,
      });

      console.log("📥 Response:", data);

      if (data.success) {
        toast.success(data.message);
        await fetchBlogs();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("❌ Toggle error:", error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // ✅ Get blog status badge with icons
  const getStatusBadge = () => {
    if (isPublished && isApproved) {
      return (
        <span className="flex items-center gap-1 text-green-600 font-semibold">
          <FaCheckCircle /> Published
        </span>
      );
    }
    if (!isApproved) {
      return (
        <span className="flex items-center gap-1 text-orange-600 font-semibold">
          <FaTimesCircle /> Pending Approval
        </span>
      );
    }
    if (!isPublished) {
      return (
        <span className="flex items-center gap-1 text-gray-600 font-semibold">
          📝 Draft
        </span>
      );
    }
    return <span className="text-gray-600">Unknown</span>;
  };

  const authorName = authorId?.name || author?.name || "Unknown Author";

  if (!blog) {
    return (
      <tr className="border-y border-gray-300">
        <td colSpan="5" className="px-2 py-4 text-center text-gray-500">
          Loading...
        </td>
      </tr>
    );
  }

  const approveAndPublish = async () => {
    try {
        const {data} = await axios.post('/api/blog/admin/approve-publish', {id: blog._id})
        if(data.success){
            toast.success(data.message)
            await fetchBlogs()
        } else{
            toast.error(data.message)
        }
    } catch (error) {
        toast.error(error.response?.data?.message || error.message)
    }
}

// Add this button for pending blogs (inside the actions cell)
{userData?.role === 'admin' && !isApproved && (
    <button 
        onClick={approveAndPublish}
        className="flex items-center gap-1 border border-blue-500 text-blue-700 hover:bg-blue-500/30 px-3 py-1.5 rounded transition-colors whitespace-nowrap cursor-pointer font-medium"
        title="Approve and publish immediately"
    >
        <FaCheckCircle /> Approve & Publish
    </button>
)}

  return (
    <tr className="border-y border-gray-300">
      <th className="px-2 py-4 text-zinc-700">{index}</th>
      <td className="px-2 py-4 text-zinc-700">
        <div>
          <p className="font-medium">{title}</p>
          {userData?.role === "admin" && (
            <p className="text-xs text-gray-500 mt-1">By: {authorName}</p>
          )}
        </div>
      </td>
      <td className="px-2 py-4 max-sm:hidden text-zinc-700">
        {BlogDate.toDateString()}
      </td>
      <td className="px-2 py-4 max-sm:hidden">{getStatusBadge()}</td>
      <td className="px-2 py-4 text-xs">
        {canEdit() ? (
          <div className="flex items-center gap-3">
            {/* ✅ Admin can see publish button for ALL blogs */}
            {userData?.role === "admin" && (
              <button
                onClick={togglePublish}
                className={`flex items-center gap-1 border px-3 py-1.5 rounded transition-colors whitespace-nowrap cursor-pointer font-medium ${
                  isPublished
                    ? "border-red-500 text-red-700 hover:bg-red-600/30"
                    : "border-green-500 text-green-700 hover:bg-green-500/30"
                }`}
                title={
                  isPublished ? "Unpublish this blog" : "Publish this blog"
                }
              >
                {isPublished ? (
                  <>
                    <FaTimesCircle /> Unpublish
                  </>
                ) : (
                  <>
                    <FaCheckCircle /> Publish
                  </>
                )}
              </button>
            )}

            {/* ✅ Users see status message */}
            {userData?.role !== "admin" && !isApproved && (
              <span className="text-xs text-orange-600 italic whitespace-nowrap">
                Awaiting admin approval
              </span>
            )}

            {/* ✅ Delete button */}
            <button
              onClick={deleteBlog}
              title="Delete blog"
              className="hover:scale-110 transition-all cursor-pointer"
            >
              <span className="text-xl text-red-500">
                <ImCancelCircle />
              </span>
            </button>
          </div>
        ) : (
          <span className="text-gray-400 text-xs">View Only</span>
        )}
      </td>
    </tr>
  );
};

export default BlogTableItem;
