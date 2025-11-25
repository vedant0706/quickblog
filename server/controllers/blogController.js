import Blog from "../models/Blog.js";
import fs from 'fs';
import imagekit from "../configs/imageKit.js";
import Comment from "../models/Comment.js";
import main from "../configs/gemini.js";

// ========== ADD BLOG ==========
export const addBlog = async (req, res) => {
    try {
        console.log('📥 Received blog data:', req.body);
        console.log('📥 Received file:', req.file);

        // ✅ Get data directly from req.body (not parsed JSON)
        const { title, subTitle, description, category } = req.body;
        const imageFile = req.file;
        const userId = req.userId;
        const isAdmin = req.isAdmin;

        // ✅ Validation
        if (!title || !description || !category) {
            console.log('❌ Missing required fields:', { title: !!title, description: !!description, category: !!category });
            return res.status(400).json({ 
                success: false, 
                message: "Missing required fields: title, description, and category are required" 
            });
        }

        if (!imageFile) {
            return res.status(400).json({ 
                success: false, 
                message: "Image is required" 
            });
        }

        console.log('✅ Validation passed, uploading image...');

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

        console.log('✅ Image uploaded:', optimizedImageUrl);

        const blogData = {
            title,
            subTitle: subTitle || '',
            description,
            category,
            image: optimizedImageUrl,
            authorId: userId,
            isPublished: isAdmin ? false : false, // Always start as unpublished
            isApproved: isAdmin ? true : false,    // Admin auto-approved
        };

        const newBlog = await Blog.create(blogData);

        console.log('✅ Blog created:', newBlog._id);

        const message = isAdmin
            ? "Blog added successfully"
            : "Blog created! Waiting for admin approval to publish.";

        res.json({ success: true, message, blog: newBlog });

    } catch (error) {
        console.error('❌ Add blog error:', error);
        res.status(500).json({ success: false, message: error.message });
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
// export const getBlogById = async (req, res) => {
//     try {
//         const { blogId } = req.params;
//         const userId = req.userId;
//         const isAdmin = req.isAdmin;

//         const blog = await Blog.findById(blogId).populate('authorId', 'name email role');

//         if (!blog) {
//             return res.json({ success: false, message: "Blog not found" });
//         }

//         // Permission check:
//         const isOwner = blog.authorId._id.toString() === userId.toString();
//         const isPublicBlog = blog.isPublished && blog.isApproved;

//         if (!isAdmin && !isOwner && !isPublicBlog) {
//             return res.json({ 
//                 success: false, 
//                 message: "You don't have permission to view this blog" 
//             });
//         }

//         res.json({ success: true, blog });
//     } catch (error) {
//         res.json({ success: false, message: error.message });
//     }
// };


export const getBlogById = async (req, res) => {
    try {
        const { blogId } = req.params;
        const userId = req.userId;
        const isAdmin = req.isAdmin;

        const blog = await Blog.findById(blogId).populate('authorId', 'name email role');

        if (!blog) {
            return res.json({ success: false, message: "Blog not found" });
        }

        // 🛡️ Safe check for missing authorId
        const authorId = blog.authorId?._id ? blog.authorId._id.toString() : null;

        const isOwner =
            authorId && userId
                ? authorId === userId.toString()
                : false;

        const isPublicBlog = blog.isPublished && blog.isApproved;

        if (!isAdmin && !isOwner && !isPublicBlog) {
            return res.json({
                success: false,
                message: "You don't have permission to view this blog",
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
// ========== TOGGLE PUBLISH (Admin Only) ==========
export const togglePublish = async (req, res) => {
    try {
        const { id } = req.body;
        const userId = req.userId;
        const isAdmin = req.isAdmin;

        console.log('📝 Toggle publish request:', { id, userId, isAdmin });

        const blog = await Blog.findById(id);

        if (!blog) {
            return res.status(404).json({ 
                success: false, 
                message: "Blog not found" 
            });
        }

        const isOwner = blog.authorId.toString() === userId.toString();

        // Check permissions
        if (!isAdmin && !isOwner) {
            return res.status(403).json({
                success: false,
                message: "You don't have permission to modify this blog",
            });
        }

        // ✅ ONLY ADMINS can publish/unpublish
        if (!isAdmin) {
            return res.status(403).json({
                success: false,
                message: "Only admins can publish blogs.",
            });
        }

        // ✅ Toggle publish status
        blog.isPublished = !blog.isPublished;
        
        // ✅ When admin publishes, auto-approve
        if (blog.isPublished) {
            blog.isApproved = true;
        }

        await blog.save();

        console.log('✅ Blog publish status updated:', { 
            blogId: blog._id, 
            isPublished: blog.isPublished,
            isApproved: blog.isApproved
        });

        res.json({
            success: true,
            message: `Blog ${blog.isPublished ? 'published' : 'unpublished'} successfully`,
            blog: {
                _id: blog._id,
                isPublished: blog.isPublished,
                isApproved: blog.isApproved
            }
        });
    } catch (error) {
        console.error('❌ Toggle publish error:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
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
        console.log('📥 Received comment data:', req.body);
        
        const { blog, name, content } = req.body;
        
        // ✅ Validation
        if (!blog || !name || !content) {
            console.log('❌ Missing fields:', { blog: !!blog, name: !!name, content: !!content });
            return res.status(400).json({ 
                success: false, 
                message: "Blog ID, name, and content are required" 
            });
        }

        // ✅ Check if blog exists and is published
        const blogExists = await Blog.findById(blog);
        if (!blogExists) {
            return res.status(404).json({ 
                success: false, 
                message: "Blog not found" 
            });
        }

        // ✅ Create comment data
        const commentData = {
            blog,
            name: name.trim(),
            content: content.trim(),
            isApproved: false // Always needs approval
        };

        // If user is logged in, link their account (optional)
        if (req.userId) {
            commentData.user = req.userId;
        }

        const comment = await Comment.create(commentData);
        
        console.log('✅ Comment created:', comment._id);
        
        res.json({ 
            success: true, 
            message: "Comment submitted! Waiting for admin approval.",
            comment 
        });
    } catch (error) {
        console.error('❌ Add comment error:', error);
        res.status(500).json({ 
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

// ========== APPROVE AND PUBLISH BLOG (Admin Only) ==========
export const approveAndPublishBlog = async (req, res) => {
    try {
        const { id } = req.body;
        const isAdmin = req.isAdmin;

        if (!isAdmin) {
            return res.status(403).json({
                success: false,
                message: "Only admins can approve blogs",
            });
        }

        const blog = await Blog.findById(id);

        if (!blog) {
            return res.status(404).json({ 
                success: false, 
                message: "Blog not found" 
            });
        }

        // ✅ Approve and publish in one action
        blog.isApproved = true;
        blog.isPublished = true;

        await blog.save();

        console.log('✅ Blog approved and published:', blog._id);

        res.json({
            success: true,
            message: "Blog approved and published successfully!",
            blog
        });
    } catch (error) {
        console.error('❌ Approve and publish error:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
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