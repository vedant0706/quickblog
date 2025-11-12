// routes/commentRoutes.js
import express from 'express';
import {
    getMyBlogComments,
    deleteCommentByUser
} from '../controllers/commentController.js';
import userAuth from '../middleware/userAuth.js';

const commentRouter = express.Router();

// ========== USER ROUTES (Blog owner can manage comments on their blogs) ==========
// Get comments on user's own blogs
commentRouter.get('/my-blog-comments', userAuth, getMyBlogComments);

// Delete comment (blog owner or admin can delete)
commentRouter.post('/delete', userAuth, deleteCommentByUser);

export default commentRouter;