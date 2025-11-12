import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    blog: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "blog", 
      required: true 
    },
    name: { 
      type: String, 
      required: true 
    },
    content: { 
      type: String, 
      required: true 
    },
    isApproved: { 
      type: Boolean, 
      default: false 
    },
    // Optional: link to user if they're logged in
    // This field is NOT required - guests can also comment
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: false,  // ✅ NOT required
      default: null     // ✅ Default to null
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;