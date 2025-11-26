import Blog from "../models/Blog.js";

// Get all approved and published blogs (Public - no auth required)
export const getAllApprovedBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ isApproved: true, isPublished: true })
      .populate("authorId", "name")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      blogs,
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Get single approved blog by ID (Public - no auth required)
export const getApprovedBlogById = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findOne({
      _id: id,
      isApproved: true,
      isPublished: true,
    }).populate("authorId", "name email");

    if (!blog) {
      return res.json({ success: false, message: "Blog not found" });
    }

    return res.json({
      success: true,
      blog,
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Get blogs by category (Public - no auth required)
export const getBlogsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const blogs = await Blog.find({
      category,
      isApproved: true,
      isPublished: true,
    })
      .populate("authorId", "name")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      blogs,
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Get latest approved blogs (Public - no auth required)
export const getLatestBlogs = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const blogs = await Blog.find({ isApproved: true, isPublished: true })
      .populate("authorId", "name")
      .sort({ createdAt: -1 })
      .limit(limit);

    return res.json({
      success: true,
      blogs,
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
