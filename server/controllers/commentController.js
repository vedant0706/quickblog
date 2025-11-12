// controllers/commentController.js
import Comment from "../models/Comment.js";
import Blog from "../models/Blog.js";

// ========== GET COMMENTS ON USER'S BLOGS ==========
// Users see comments only on their own blogs
export const getMyBlogComments = async (req, res) => {
    try {
        const userId = req.userId;

        // Get all blogs by this user
        const myBlogs = await Blog.find({ authorId: userId }).select('_id');
        const myBlogIds = myBlogs.map(blog => blog._id);

        // Get all comments on user's blogs
        const comments = await Comment.find({ 
            blog: { $in: myBlogIds } 
        })
        .populate('blog', 'title authorId')
        .sort({ createdAt: -1 });

        res.json({ success: true, comments });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// ========== DELETE COMMENT ==========
// Blog owner OR admin can delete comments
export const deleteCommentByUser = async (req, res) => {
    try {
        const { id } = req.body;
        const userId = req.userId;
        const isAdmin = req.isAdmin;

        const comment = await Comment.findById(id).populate('blog', 'authorId title');

        if (!comment) {
            return res.json({ success: false, message: "Comment not found" });
        }

        // Check permissions:
        // 1. Admin can delete any comment
        // 2. Blog owner can delete comments on their blog
        const isBlogOwner = comment.blog.authorId.toString() === userId.toString();

        if (!isAdmin && !isBlogOwner) {
            return res.json({ 
                success: false, 
                message: "Only the blog owner or admin can delete this comment" 
            });
        }

        await Comment.findByIdAndDelete(id);

        res.json({ 
            success: true, 
            message: "Comment deleted successfully" 
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};