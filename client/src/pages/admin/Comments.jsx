import React, { useEffect, useState } from "react";
import CommentTableItem from "../../components/admin/CommentTableItem";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const Comments = () => {
  const [comments, setComments] = useState([]);
  const [filter, setFilter] = useState("Not Approved");
  const { axios, userData } = useAppContext();

  const fetchComments = async () => {
    try {
      const endpoint =
        userData?.role === "admin"
          ? "/api/admin/comments"
          : "/api/comment/my-blog-comments";

      const { data } = await axios.get(endpoint);

      if (data.success) {
        setComments(data.comments || []);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (userData) {
      fetchComments();
    }
  }, [userData]);

  const filteredComments = comments.filter((comment) => {
    if (filter === "Approved") return comment.isApproved === true;
    return comment.isApproved === false;
  });

  return (
    <div className="flex-1 pt-5 px-5 sm:pt-12 sm:pl-16 bg-[#112D4E]/3">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center max-w-3xl mb-4 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-black">
            {userData?.role === "admin"
              ? "All Comments"
              : "Comments on My Blogs"}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {userData?.role === "admin"
              ? "Manage all comments across the platform"
              : "Manage comments on your blogs"}
          </p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setFilter("Approved")}
            className={`shadow-sm border rounded-full px-4 py-1.5 cursor-pointer text-xs transition-colors ${
              filter === "Approved"
                ? "bg-green-600 text-white border-green-600"
                : "bg-green-500/50 text-black hover:bg-green-400"
            }`}
          >
            Approved ({comments.filter((c) => c.isApproved).length})
          </button>

          <button
            onClick={() => setFilter("Not Approved")}
            className={`shadow-sm border rounded-full px-4 py-1.5 cursor-pointer text-xs transition-colors ${
              filter === "Not Approved"
                ? "bg-orange-600 text-white border-orange-600"
                : "bg-orange-500/50 text-black hover:bg-orange-300"
            }`}
          >
            Pending ({comments.filter((c) => !c.isApproved).length})
          </button>
        </div>
      </div>

      {filteredComments.length === 0 ? (
        <div className="text-center py-10 text-gray-500 bg-white rounded-lg shadow max-w-3xl">
          <p>
            {filter === "Approved"
              ? "No approved comments yet."
              : "No pending comments."}
          </p>
        </div>
      ) : (
        <div className="relative h-4/5 max-w-3xl overflow-x-auto mt-4 bg-gray-50 border-2 border-[#112D4E] shadow rounded-lg scrollbar-hide">
          <table className="w-full text-sm text-zinc-900">
            <thead className="text-xs text-zinc-900 text-left uppercase border-b">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Blog Title & Comment
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 max-sm:hidden text-zinc-900"
                >
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-zinc-900">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredComments.map((comment) => (
                <CommentTableItem
                  key={comment._id}
                  comment={comment}
                  fetchComments={fetchComments}
                  isAdmin={userData?.role === "admin"}
                  loggedInUserId={userData._id}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Comments;
