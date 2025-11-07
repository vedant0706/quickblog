import express from "express"
import { addBlog, addComment, deleteBlogById, generateContent, getAllBlogs, getBlogById, getBlogComments, togglePublish } from "../controllers/blogController.js";
import upload from "../middleware/multer.js";
import userAuth from "../middleware/userAuth.js";

const blogRouter = express.Router();

blogRouter.post("/add", upload.single('image'), userAuth, addBlog);  
blogRouter.get("/all",userAuth, getAllBlogs);
blogRouter.get("/:blogId", userAuth, getBlogById);
blogRouter.post("/delete", userAuth, deleteBlogById);
blogRouter.post("/toggle-publish", userAuth, togglePublish);
blogRouter.post('/add-comment', addComment);
blogRouter.post('/comments', getBlogComments);
blogRouter.post('/generate', userAuth, generateContent);

export default blogRouter;