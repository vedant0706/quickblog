import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subTitle: { type: String },
    description: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    
    // Author tracking
    authorId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'user',
      required: true 
    },
    
    // Publishing controls
    isPublished: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: false },
    
    // Timestamps
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Blog = mongoose.model.blog || mongoose.model("blog", blogSchema);

export default Blog;