import Blog from "../models/Blog.js";

// Get all user's own blogs
export const getMyBlogs = async (req, res) => {
  try {
    const userId = req.userId;

    const blogs = await Blog.find({ authorId: userId }).sort({ createdAt: -1 });

    return res.json({
      success: true,
      blogs,
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Update user's own blog
export const updateMyBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const { title, subTitle, description, category, image, isPublished } =
      req.body;

    // Find the blog
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.json({ success: false, message: "Blog not found" });
    }

    // Check if user owns this blog
    if (blog.authorId.toString() !== userId.toString()) {
      return res.json({
        success: false,
        message: "You don't have permission to edit this blog",
      });
    }

    // Update blog
    const updateData = {};
    if (title) updateData.title = title;
    if (subTitle) updateData.subTitle = subTitle;
    if (description) updateData.description = description;
    if (category) updateData.category = category;
    if (image) updateData.image = image;
    if (typeof isPublished !== "undefined")
      updateData.isPublished = isPublished;

    // Reset approval status when edited
    updateData.isApproved = false;

    const updatedBlog = await Blog.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    return res.json({
      success: true,
      message: "Blog updated successfully! Waiting for admin approval.",
      blog: updatedBlog,
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Delete user's own blog
export const deleteMyBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    // Find the blog
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.json({ success: false, message: "Blog not found" });
    }

    // Check if user owns this blog
    if (blog.authorId.toString() !== userId.toString()) {
      return res.json({
        success: false,
        message: "You don't have permission to delete this blog",
      });
    }

    await Blog.findByIdAndDelete(id);

    return res.json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
