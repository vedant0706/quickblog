import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    blog: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "blog", 
      required: true,
      index: true // ✅ Add index for faster queries
    },
    name: { 
      type: String, 
      required: true,
      trim: true
    },
    content: { 
      type: String, 
      required: true,
      trim: true
    },
    isApproved: { 
      type: Boolean, 
      default: false,
      index: true // ✅ Add index for filtering
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: false,
      default: null
    },
  },
  { timestamps: true }
);

// ✅ Add index for common queries
commentSchema.index({ blog: 1, isApproved: 1 });

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;