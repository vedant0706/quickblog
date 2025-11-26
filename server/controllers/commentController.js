import Comment from "../models/Comment.js";
import Blog from "../models/Blog.js";

export const getMyBlogComments = async (req, res) => {
  try {
    const userId = req.userId;

    const myBlogs = await Blog.find({ authorId: userId }).select("_id");
    const myBlogIds = myBlogs.map((blog) => blog._id);

    const comments = await Comment.find({
      blog: { $in: myBlogIds },
    })
      .populate("blog", "title authorId")
      .sort({ createdAt: -1 });

    res.json({ success: true, comments });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getMyComments = async (req, res) => {
  try {
    const userId = req.userId;

    const comments = await Comment.find({ user: userId })
      .populate("blog", "title authorId")
      .sort({ createdAt: -1 });

    res.json({ success: true, comments });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const toggleMyComment = async (req, res) => {
  try {
    const { id } = req.body;
    const userId = req.userId;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.json({ success: false, message: "Comment not found" });
    }

    if (!comment.user || comment.user.toString() !== userId.toString()) {
      return res.json({
        success: false,
        message: "You can only modify your own comments",
      });
    }

    comment.isApproved = !comment.isApproved;
    await comment.save();

    res.json({
      success: true,
      message: `Comment ${comment.isApproved ? "published" : "unpublished"}`,
      comment,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const deleteCommentByUser = async (req, res) => {
  try {
    const { id } = req.body;
    const userId = req.userId;
    const isAdmin = req.isAdmin;

    const comment = await Comment.findById(id).populate(
      "blog",
      "authorId title"
    );

    if (!comment) {
      return res.json({ success: false, message: "Comment not found" });
    }

    const isBlogOwner = comment.blog.authorId.toString() === userId.toString();

    if (!isAdmin && !isBlogOwner) {
      return res.json({
        success: false,
        message: "Only the blog owner or admin can delete this comment",
      });
    }

    await Comment.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
