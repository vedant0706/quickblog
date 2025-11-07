import Blog from "../models/Blog.js";
import fs from 'fs'
import imagekit from "../configs/imageKit.js";
import Comment from "../models/Comment.js";
import main from "../configs/gemini.js";

export const addBlog = async (req, res) => {
    try{
        const {title, subTitle, description, category, isPublished} = JSON.parse(req.body.blog);
        const imageFile = req.file;
        const userId = req.userId; // Get userId from middleware
        const isAdmin = req.isAdmin; // Check if user is admin

        // Check if all fields are present
        if(!title || !description || !category || !imageFile){
            return res.json({success: false, message: "Missing required fields"})
        }

        const fileBuffer = fs.readFileSync(imageFile.path)

        // Upload Image to ImageKit
        const response = await imagekit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,   
            folder: "/blogs"
        });

        // optimization through imageKit URL transformation
        const optimizedImageUrl = imagekit.url({
            path: response.filePath,
            transformation: [
                {quality: 'auto'}, // Auto compression
                {format: 'webp'}, // Convert to modern format
                {width: '1280'}, // Width resizing
            ]
        });

        const image = optimizedImageUrl;

        // Add authorId and approval status
        const blogData = {
            title, 
            subTitle, 
            description, 
            category, 
            image,
            authorId: userId, // Track who created the blog
            isPublished: isAdmin ? isPublished : false, // Only admin can publish directly
            isApproved: isAdmin ? true : false, // Admin blogs auto-approved
        };

        await Blog.create(blogData);

        const message = isAdmin 
            ? "Blog added successfully" 
            : "Blog created! Waiting for admin approval.";

        res.json({success: true, message})

    } catch (error){
        res.json({success: false, message: error.message})
    }
}


export const getAllBlogs = async (req, res) => {
    try{
        const userId = req.userId;
        const isAdmin = req.isAdmin;

        let blogs;
        
        if (isAdmin) {
            // Admin can see all blogs
            blogs = await Blog.find({}).populate('authorId', 'name email').sort({ createdAt: -1 });
        } else {
            // Regular users see only approved & published blogs OR their own blogs
            blogs = await Blog.find({
                $or: [
                    { isPublished: true, isApproved: true },
                    { authorId: userId }
                ]
            }).populate('authorId', 'name').sort({ createdAt: -1 });
        }

        res.json({success: true, blogs})
    } catch (error){
        res.json({success: false, message: error.message})
    }
}

export const getBlogById = async (req,res) => {
    try{
        const { blogId } = req.params;
        const userId = req.userId;
        const isAdmin = req.isAdmin;

        const blog = await Blog.findById(blogId).populate('authorId', 'name email');
        
        if(!blog){
            return res.json({success: false, message: "Blog not found"})
        }

        // Check if user has permission to view this blog
        if (!isAdmin && !blog.isPublished && blog.authorId._id.toString() !== userId.toString()) {
            return res.json({success: false, message: "You don't have permission to view this blog"})
        }

        res.json({success: true, blog})
    } catch (error){
        res.json({success: false, message: error.message})
    }
}

export const deleteBlogById = async (req,res) => {
    try{
        const { id } = req.body;
        const userId = req.userId;
        const isAdmin = req.isAdmin;

        const blog = await Blog.findById(id);

        if (!blog) {
            return res.json({ success: false, message: "Blog not found" });
        }

        // Allow deletion if user is admin OR if user owns the blog
        if (!isAdmin && blog.authorId.toString() !== userId.toString()) {
            return res.json({
                success: false,
                message: "You don't have permission to delete this blog",
            });
        }

        await Blog.findByIdAndDelete(id);

        // Delete all comments associated with the blog
        await Comment.deleteMany({blog: id});

        res.json({success: true, message: "Blog deleted successfully"})
    } catch (error){
        res.json({success: false, message: error.message})
    }
}

export const togglePublish = async (req, res) => {
    try {
        const { id } = req.body;
        const userId = req.userId;
        const isAdmin = req.isAdmin;

        const blog = await Blog.findById(id);

        if (!blog) {
            return res.json({ success: false, message: "Blog not found" });
        }

        // Allow toggle if user is admin OR if user owns the blog
        if (!isAdmin && blog.authorId.toString() !== userId.toString()) {
            return res.json({
                success: false,
                message: "You don't have permission to modify this blog",
            });
        }

        blog.isPublished = !blog.isPublished;

        // If not admin, set isApproved to false (needs admin approval)
        if (!isAdmin) {
            blog.isApproved = false;
        }

        await blog.save();

        const message = isAdmin 
            ? `Blog ${blog.isPublished ? 'published' : 'unpublished'} successfully`
            : "Blog updated! Waiting for admin approval.";

        res.json({success: true, message})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

export const addComment = async (req, res) => {
    try {
        const {blog, name, content} = req.body;
        await Comment.create({blog, name, content})
        res.json({success: true, message: "Comment added for review"})
    } catch (error) {
        res.json ({success: false, message: error.message})
    }
}

export const getBlogComments = async (req, res) => {
    try {
        const { blogId } = req.body;
        const comments = await Comment.find({blog: blogId, isApproved: true}).sort({createdAt: -1})
        res.json({success: true, comments})
    } catch (error) {
        res.json ({success: false, message: error.message})
    }
}

export const generateContent = async (req, res) => {
    try {
        const {prompt} = req.body;
        const content = await main(prompt + ' Generate a blog content for this topic in simple text format')
        res.json({success: true, content})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}