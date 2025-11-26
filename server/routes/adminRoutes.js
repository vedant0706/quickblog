import express from "express"
import { 
  approveCommentById, 
  deleteCommentById, 
  getAllBlogsAdmin, 
  getAllComments, 
  getDashboard 
} from "../controllers/adminController.js";
import adminAuth from "../middleware/adminAuth.js";

const adminRouter = express.Router()

// All admin routes require admin authentication
adminRouter.get("/comments", adminAuth, getAllComments);
adminRouter.get("/blogs", adminAuth, getAllBlogsAdmin);
adminRouter.post("/delete-comment", adminAuth, deleteCommentById);
adminRouter.post("/approve-comment", adminAuth, approveCommentById);
adminRouter.get("/dashboard", adminAuth, getDashboard);

export default adminRouter;