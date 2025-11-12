import Blog from "../models/Blog.js";
import fs from 'fs';
import imagekit from "../configs/imageKit.js";
import Comment from "../models/Comment.js";
import main from "../configs/gemini.js";

// ========== ADD BLOG ==========
export const addBlog = async (req, res) => {
    try {
        const { title, subTitle, description, category, isPublished } = JSON.parse(req.body.blog);
        const imageFile = req.file;
        const userId = req.userId;
        const isAdmin = req.isAdmin;

        if (!title || !description || !category || !imageFile) {
            return res.json({ success: false, message: "Missing required fields" });
        }

        const fileBuffer = fs.readFileSync(imageFile.path);

        // Upload Image to ImageKit
        const response = await imagekit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: "/blogs"
        });

        const optimizedImageUrl = imagekit.url({
            path: response.filePath,
            transformation: [
                { quality: 'auto' },
                { format: 'webp' },
                { width: '1280' },
            ]
        });

        const image = optimizedImageUrl;

        // PERMISSION LOGIC:
        // - Admins can create and publish immediately
        // - Users can create but need admin approval before publishing
        const blogData = {
            title,
            subTitle,
            description,
            category,
            image,
            authorId: userId,
            isPublished: isAdmin ? (isPublished || false) : false,
            isApproved: isAdmin ? true : false,
        };

        const newBlog = await Blog.create(blogData);

        const message = isAdmin
            ? "Blog added successfully"
            : "Blog created! Waiting for admin approval to publish.";

        res.json({ success: true, message, blog: newBlog });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// ========== GET ALL BLOGS - Updated to show published blogs to everyone ==========
export const getAllBlogs = async (req, res) => {
    try {
        const userId = req.userId;
        const isAdmin = req.isAdmin;

        let blogs;

        if (isAdmin) {
            // Admin sees ALL blogs (any status)
            blogs = await Blog.find({})
                .populate('authorId', 'name email role')
                .sort({ createdAt: -1 });
        } else {
            // Regular users see:
            // 1. ALL published & approved blogs (from anyone)
            // 2. Their own blogs (any status)
            blogs = await Blog.find({
                $or: [
                    { isPublished: true, isApproved: true }, // All published blogs
                    { authorId: userId } // User's own blogs
                ]
            })
            .populate('authorId', 'name email')
            .sort({ createdAt: -1 });
        }

        res.json({ success: true, blogs });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// ========== GET MY BLOGS ONLY (for dashboard) ==========
export const getMyBlogs = async (req, res) => {
    try {
        const userId = req.userId;

        const blogs = await Blog.find({ authorId: userId })
            .populate('authorId', 'name email')
            .sort({ createdAt: -1 });

        res.json({ success: true, blogs });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// ========== GET MY DASHBOARD STATS (user's own stats) ==========
export const getMyDashboard = async (req, res) => {
    try {
        const userId = req.userId;

        // Get user's own blogs
        const myBlogs = await Blog.find({ authorId: userId })
            .populate('authorId', 'name email')
            .sort({ createdAt: -1 })
            .limit(5);

        // Count user's blogs
        const blogs = await Blog.countDocuments({ authorId: userId });

        // Count user's drafts
        const drafts = await Blog.countDocuments({ 
            authorId: userId,
            isPublished: false 
        });

        // Count comments on user's blogs
        const myBlogIds = await Blog.find({ authorId: userId }).distinct('_id');
        const comments = await Comment.countDocuments({ 
            blog: { $in: myBlogIds } 
        });

        const dashboardData = {
            blogs,
            comments,
            drafts,
            recentBlogs: myBlogs
        };

        res.json({ success: true, dashboardData });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// ========== GET BLOG BY ID ==========
export const getBlogById = async (req, res) => {
    try {
        const { blogId } = req.params;
        const userId = req.userId;
        const isAdmin = req.isAdmin;

        const blog = await Blog.findById(blogId).populate('authorId', 'name email role');

        if (!blog) {
            return res.json({ success: false, message: "Blog not found" });
        }

        // Permission check:
        const isOwner = blog.authorId._id.toString() === userId.toString();
        const isPublicBlog = blog.isPublished && blog.isApproved;

        if (!isAdmin && !isOwner && !isPublicBlog) {
            return res.json({ 
                success: false, 
                message: "You don't have permission to view this blog" 
            });
        }

        res.json({ success: true, blog });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// ========== DELETE BLOG ==========
export const deleteBlogById = async (req, res) => {
    try {
        const { id } = req.body;
        const userId = req.userId;
        const isAdmin = req.isAdmin;

        const blog = await Blog.findById(id);

        if (!blog) {
            return res.json({ success: false, message: "Blog not found" });
        }

        const isOwner = blog.authorId.toString() === userId.toString();

        // Only admin OR owner can delete
        if (!isAdmin && !isOwner) {
            return res.json({
                success: false,
                message: "You don't have permission to delete this blog",
            });
        }

        await Blog.findByIdAndDelete(id);
        await Comment.deleteMany({ blog: id });

        res.json({ success: true, message: "Blog deleted successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// ========== TOGGLE PUBLISH ==========
export const togglePublish = async (req, res) => {
    try {
        const { id } = req.body;
        const userId = req.userId;
        const isAdmin = req.isAdmin;

        const blog = await Blog.findById(id);

        if (!blog) {
            return res.json({ success: false, message: "Blog not found" });
        }

        const isOwner = blog.authorId.toString() === userId.toString();

        // Check permissions
        if (!isAdmin && !isOwner) {
            return res.json({
                success: false,
                message: "You don't have permission to modify this blog",
            });
        }

        // CRITICAL: Only admins can actually PUBLISH
        if (!isAdmin) {
            return res.json({
                success: false,
                message: "Only admins can publish blogs. Your blog needs admin approval.",
            });
        }

        // Admin can toggle publish
        blog.isPublished = !blog.isPublished;
        
        // If admin publishes, auto-approve
        if (blog.isPublished) {
            blog.isApproved = true;
        }

        await blog.save();

        res.json({
            success: true,
            message: `Blog ${blog.isPublished ? 'published' : 'unpublished'} successfully`
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// ========== UPDATE BLOG ==========
export const updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, subTitle, description, category } = req.body;
        const userId = req.userId;
        const isAdmin = req.isAdmin;

        const blog = await Blog.findById(id);

        if (!blog) {
            return res.json({ success: false, message: "Blog not found" });
        }

        const isOwner = blog.authorId.toString() === userId.toString();

        // Only admin OR owner can update
        if (!isAdmin && !isOwner) {
            return res.json({
                success: false,
                message: "You don't have permission to update this blog",
            });
        }

        // Update fields
        if (title) blog.title = title;
        if (subTitle !== undefined) blog.subTitle = subTitle;
        if (description) blog.description = description;
        if (category) blog.category = category;

        // If user (not admin) updates, reset approval
        if (!isAdmin && isOwner) {
            blog.isApproved = false;
            blog.isPublished = false;
        }

        await blog.save();

        const message = isAdmin
            ? "Blog updated successfully"
            : "Blog updated! Needs admin approval to publish.";

        res.json({ success: true, message, blog });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// ========== COMMENTS ==========
// Find the addComment function in your blogController.js and replace it with this:

// ========== ADD COMMENT (Updated - No user field required) ==========
export const addComment = async (req, res) => {
    try {
        const { blog, name, content } = req.body;
        
        if (!blog || !name || !content) {
            return res.json({ 
                success: false, 
                message: "Blog, name, and content are required" 
            });
        }

        // Check if blog exists
        const blogExists = await Blog.findById(blog);
        if (!blogExists) {
            return res.json({ 
                success: false, 
                message: "Blog not found" 
            });
        }

        // Create comment WITHOUT user field
        // User field is optional - can be added later if needed
        const commentData = {
            blog,
            name,
            content
        };

        // If user is logged in (optional), you can add their ID
        // But this is NOT required
        if (req.userId) {
            commentData.user = req.userId;
        }

        const comment = await Comment.create(commentData);
        
        res.json({ 
            success: true, 
            message: "Comment added! Waiting for admin approval.",
            comment 
        });
    } catch (error) {
        res.json({ 
            success: false, 
            message: error.message 
        });
    }
};

export const getBlogComments = async (req, res) => {
    try {
        const { blogId } = req.body;
        const comments = await Comment.find({ 
            blog: blogId, 
            isApproved: true 
        }).sort({ createdAt: -1 });
        
        res.json({ success: true, comments });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// ========== AI CONTENT GENERATION ==========
export const generateContent = async (req, res) => {
    try {
        const { prompt } = req.body;
        
        if (!prompt) {
            return res.json({ success: false, message: "Prompt is required" });
        }

        const content = await main(
            prompt + ' Generate a blog content for this topic in simple text format'
        );
        
        res.json({ success: true, content });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};