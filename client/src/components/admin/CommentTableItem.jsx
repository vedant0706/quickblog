import React from "react";
import { assets } from '../../assets/Assets.jsx';
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const CommentTableItem = ({ comment, fetchComments, isAdmin }) => {
  const { blog, createdAt, _id, name, content, isApproved } = comment;
  const BlogDate = new Date(createdAt);

  const { axios } = useAppContext();

  const approveComment = async () => {
    try {
      const { data } = await axios.post('/api/admin/approve-comment', { id: _id });
      if (data.success) {
        toast.success(data.message);
        fetchComments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const deleteComment = async () => {
    try {
      const confirm = window.confirm('Are you sure, you want to delete this comment?');
      if (!confirm) return;

      // Use different endpoint based on role
      const endpoint = isAdmin 
        ? '/api/admin/delete-comment'    // Admin uses admin endpoint
        : '/api/comment/delete';         // User uses comment endpoint

      const { data } = await axios.post(endpoint, { id: _id });
      
      if (data.success) {
        toast.success(data.message);
        fetchComments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <tr className="border-y border-gray-900">
      <td className="px-6 py-4">
        <div className="space-y-2">
          <div>
            <b className="font-bold text-gray-800">Blog:</b>{' '}
            <span className="text-gray-800">{blog?.title || 'Unknown Blog'}</span>
          </div>
          <div>
            <b className="font-bold text-gray-800">Name:</b>{' '}
            <span className="text-gray-800">{name}</span>
          </div>
          <div>
            <b className="font-bold text-gray-800">Comment:</b>{' '}
            <span className="text-gray-800">{content}</span>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 max-sm:hidden">
        {BlogDate.toLocaleDateString()}
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          {/* Only admin can approve comments */}
          {isAdmin && !isApproved ? (
            <img
              onClick={approveComment}
              src={assets.tick_icon}
              alt="Approve"
              title="Approve comment"
              className="w-5 hover:scale-110 transition-all cursor-pointer"
            />
          ) : isApproved ? (
            <p className="text-xs border border-green-600 text-green-600 bg-green-600/20 rounded-full px-3 py-1">
              Approved
            </p>
          ) : (
            <p className="text-xs text-orange-600">
              Pending
            </p>
          )}

          {/* Both admin and blog owner can delete */}
          <img
            onClick={deleteComment}
            src={assets.bin_icon}
            alt="Delete"
            title={isAdmin ? "Delete comment (Admin)" : "Delete comment (Blog Owner)"}
            className="w-5 hover:scale-110 transition-all cursor-pointer"
          />
        </div>
      </td>
    </tr>
  );
};

export default CommentTableItem;