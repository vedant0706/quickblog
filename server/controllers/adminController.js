import jwt from "jsonwebtoken";
import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js";

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET);
    res.json({ success: true, token });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get all blogs (admin sees everything)
export const getAllBlogsAdmin = async (req, res) => {
  try {
    if (!req.isAdmin) {
      return res.json({
        success: false,
        message: "Admin access required",
      });
    }

    const blogs = await Blog.find({})
      .populate("authorId", "name email role")
      .sort({ createdAt: -1 });

    res.json({ success: true, blogs });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get all comments (admin only)
export const getAllComments = async (req, res) => {
  try {
    if (!req.isAdmin) {
      return res.json({
        success: false,
        message: "Admin access required",
      });
    }

    const comments = await Comment.find({})
      .populate("blog", "title")
      .sort({ createdAt: -1 });

    res.json({ success: true, comments });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get admin dashboard data
export const getDashboard = async (req, res) => {
  try {
    if (!req.isAdmin) {
      return res.json({
        success: false,
        message: "Admin access required",
      });
    }

    const recentBlogs = await Blog.find({})
      .populate("authorId", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    const blogs = await Blog.countDocuments();
    const comments = await Comment.countDocuments();
    const drafts = await Blog.countDocuments({ isPublished: false });
    const pendingApproval = await Blog.countDocuments({ isApproved: false });

    const dashboardData = {
      blogs,
      comments,
      drafts,
      pendingApproval,
      recentBlogs,
    };

    res.json({ success: true, dashboardData });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Delete any comment (admin only)
export const deleteCommentById = async (req, res) => {
  try {
    if (!req.isAdmin) {
      return res.json({
        success: false,
        message: "Admin access required",
      });
    }

    const { id } = req.body;
    await Comment.findByIdAndDelete(id);
    res.json({ success: true, message: "Comment deleted successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Approve comment (admin only)
export const approveCommentById = async (req, res) => {
  try {
    if (!req.isAdmin) {
      return res.json({
        success: false,
        message: "Admin access required",
      });
    }

    const { id } = req.body;
    await Comment.findByIdAndUpdate(id, { isApproved: true });
    res.json({ success: true, message: "Comment approved successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
