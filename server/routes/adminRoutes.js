import express from "express"
import { approveCommentById, deleteCommentById, getAllBlogsAdmin, getAllComments, getDashboard } from "../controllers/adminController.js";
import userAuth from "../middleware/userAuth.js";


const adminRouter = express.Router()

// adminRouter.post("/login", adminLogin);
adminRouter.get("/comments", userAuth, getAllComments);
adminRouter.get("/blogs",userAuth, getAllBlogsAdmin);
adminRouter.post("/delete-comment", userAuth, deleteCommentById);
adminRouter.post("/approve-comment", userAuth, approveCommentById);
adminRouter.get("/dashboard", userAuth, getDashboard);

export default adminRouter;