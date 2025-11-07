import express from "express";
import { 
  addBlog, 
  addComment, 
  deleteBlogById, 
  generateContent, 
  getAllBlogs, 
  getBlogById, 
  getBlogComments, 
  togglePublish 
} from "../controllers/blogController.js";
import upload from "../middleware/multer.js";
import userAuth from "../middleware/userAuth.js";
import adminAuth from "../middleware/adminAuth.js";

// New user blog controllers
import {
  getMyBlogs,
  updateMyBlog,
  deleteMyBlog,
} from '../controllers/userBlogController.js';

// New admin blog controllers
import {
  getPendingBlogs,
  approveBlog,
  rejectBlog,
  updateAnyBlog,
  deleteAnyBlog,
} from '../controllers/adminBlogController.js';

// Public blog controllers
import {
  getAllApprovedBlogs,
  getApprovedBlogById,
  getBlogsByCategory,
  getLatestBlogs,
} from '../controllers/publicBlogController.js';

const blogRouter = express.Router();

// ========== PUBLIC ROUTES (No authentication required) ==========
blogRouter.get('/public/all', getAllApprovedBlogs);
blogRouter.get('/public/latest', getLatestBlogs);
blogRouter.get('/public/category/:category', getBlogsByCategory);
blogRouter.get('/public/:id', getApprovedBlogById);

// ========== EXISTING ROUTES (Your original routes) ==========
blogRouter.post("/add", upload.single('image'), userAuth, addBlog);
blogRouter.get("/all", userAuth, getAllBlogs);
blogRouter.get("/:blogId", userAuth, getBlogById);
blogRouter.post("/delete", userAuth, deleteBlogById);
blogRouter.post("/toggle-publish", userAuth, togglePublish);
blogRouter.post('/add-comment', addComment);
blogRouter.post('/comments', getBlogComments);
blogRouter.post('/generate', userAuth, generateContent);

// ========== NEW USER ROUTES (Permission-based) ==========
blogRouter.get('/my-blogs', userAuth, getMyBlogs);
blogRouter.put('/my-blog/update/:id', userAuth, updateMyBlog);
blogRouter.delete('/my-blog/delete/:id', userAuth, deleteMyBlog);

// ========== NEW ADMIN ROUTES (Admin only) ==========
blogRouter.get('/admin/pending', adminAuth, getPendingBlogs);
blogRouter.put('/admin/approve/:id', adminAuth, approveBlog);
blogRouter.put('/admin/reject/:id', adminAuth, rejectBlog);
blogRouter.put('/admin/update/:id', adminAuth, updateAnyBlog);
blogRouter.delete('/admin/delete/:id', adminAuth, deleteAnyBlog);

export default blogRouter;