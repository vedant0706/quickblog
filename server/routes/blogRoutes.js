import express from "express";
import { 
  addBlog, 
  addComment, 
  deleteBlogById, 
  generateContent, 
  getAllBlogs, 
  getBlogById, 
  getBlogComments, 
  togglePublish,
  updateBlog,
  getMyBlogs,
  getMyDashboard
} from "../controllers/blogController.js";
import upload from "../middleware/multer.js";
import userAuth from "../middleware/userAuth.js";
import adminAuth from "../middleware/adminAuth.js";

// Import specialized controllers
import {
  updateMyBlog,
  deleteMyBlog,
} from '../controllers/userBlogController.js';

import {
  getPendingBlogs,
  approveBlog,
  rejectBlog,
  updateAnyBlog,
  deleteAnyBlog,
  createAdminBlog
} from '../controllers/adminBlogController.js';

import {
  getAllApprovedBlogs,
  getApprovedBlogById,
  getBlogsByCategory,
  getLatestBlogs,
} from '../controllers/publicBlogController.js';

const blogRouter = express.Router();

// ========== PUBLIC ROUTES (No authentication) ==========
blogRouter.get('/public/all', getAllApprovedBlogs);
blogRouter.get('/public/latest', getLatestBlogs);
blogRouter.get('/public/category/:category', getBlogsByCategory);
blogRouter.get('/public/:id', getApprovedBlogById);

// Public comments
blogRouter.post('/add-comment', addComment);
blogRouter.post('/comments', getBlogComments);

// ========== AUTHENTICATED USER ROUTES ==========
// Blog CRUD for authenticated users
blogRouter.post("/add", upload.single('image'), userAuth, addBlog);

// Get all blogs (users see: all published blogs + their own blogs)
blogRouter.get("/all", userAuth, getAllBlogs);

// Get only user's own blogs (for dashboard blog list)
blogRouter.get("/my-blogs", userAuth, getMyBlogs);

// Get user's own dashboard stats
blogRouter.get("/my-dashboard", userAuth, getMyDashboard);

// Single blog view
blogRouter.get("/:blogId", userAuth, getBlogById);

// Update/Delete operations
blogRouter.put("/update/:id", userAuth, updateBlog);
blogRouter.post("/delete", userAuth, deleteBlogById);
blogRouter.post("/toggle-publish", userAuth, togglePublish);

// AI Generation
blogRouter.post('/generate', userAuth, generateContent);

// ========== ADMIN ONLY ROUTES ==========
// Blog management
blogRouter.get('/admin/pending', adminAuth, getPendingBlogs);
blogRouter.post('/admin/create', upload.single('image'), adminAuth, createAdminBlog);
blogRouter.put('/admin/approve/:id', adminAuth, approveBlog);
blogRouter.put('/admin/reject/:id', adminAuth, rejectBlog);
blogRouter.put('/admin/update/:id', adminAuth, updateAnyBlog);
blogRouter.delete('/admin/delete/:id', adminAuth, deleteAnyBlog);

export default blogRouter;