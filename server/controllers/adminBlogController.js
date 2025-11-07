import blog from "../models/Blog.js";

// Get all blogs (including unapproved) - Admin only
export const getAllBlogsAdmin = async (req, res) => {
  try {
    const blogs = await blog.find({})
      .populate('authorId', 'name email')
      .sort({ date: -1 });

    return res.json({
      success: true,
      blogs,
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Get pending blogs (unapproved) - Admin only
export const getPendingBlogs = async (req, res) => {
  try {
    const blogs = await blog.find({ isApproved: false })
      .populate('name', 'email')
      .sort({ date: -1 });

    return res.json({
      success: true,
      blogs,
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Approve a blog - Admin only
export const approveBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await blog.findById(id);

    if (!blog) {
      return res.json({ success: false, message: "Blog not found" });
    }

    blog.isApproved = true;
    await blog.save();

    return res.json({
      success: true,
      message: "Blog approved successfully",
      blog,
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Reject/Unapprove a blog - Admin only
export const rejectBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await blog.findById(id);

    if (!blog) {
      return res.json({ success: false, message: "Blog not found" });
    }

    blog.isApproved = false;
    await blog.save();

    return res.json({
      success: true,
      message: "Blog rejected successfully",
      blog,
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Update any blog - Admin only
export const updateAnyBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, image, author, isApproved } = req.body;

    const blog = await blog.findById(id);

    if (!blog) {
      return res.json({ success: false, message: "Blog not found" });
    }

    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (category) updateData.category = category;
    if (image) updateData.image = image;
    if (author) updateData.author = author;
    if (typeof isApproved !== 'undefined') updateData.isApproved = isApproved;

    const updatedBlog = await blog.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    return res.json({
      success: true,
      message: "Blog updated successfully",
      blog: updatedBlog,
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Delete any blog - Admin only
export const deleteAnyBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await blog.findById(id);

    if (!blog) {
      return res.json({ success: false, message: "Blog not found" });
    }

    await blog.findByIdAndDelete(id);

    return res.json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Create blog as admin (auto-approved)
export const createAdminBlog = async (req, res) => {
  try {
    const { title, description, category, image, author } = req.body;

    if (!title || !description || !category || !image || !author) {
      return res.json({ success: false, message: "All fields are required" });
    }

    const blogData = {
      title,
      description,
      category,
      image,
      author,
      authorId: req.userId || req.adminId, // Use admin's ID
      isApproved: true, // Admin blogs are auto-approved
    };

    const newBlog = new blog(blogData);
    await newBlog.save();

    return res.json({
      success: true,
      message: "Blog created successfully",
      blog: newBlog,
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};