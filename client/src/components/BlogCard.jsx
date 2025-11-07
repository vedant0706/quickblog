import React from "react";
import { useNavigate } from "react-router-dom";

const BlogCard = ({ blogs }) => {
  const { title, description, category, image, _id } = blogs;
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/blog/${_id}`)}
      className="w-full rounded-lg overflow-hidden shadow-lg shadow-[#112D4E] hover:scale-102 duration-300 cursor-pointer"
    >
      <img src={image} alt="" className="aspect-video" />
      <span className="ml-5 mt-4 px-3 py-1 inline-block bg-[#3F72AF]/20 rounded-full text-black text-sm shadow shadow-[#112D4E] ">
        {category}
      </span>
      
      <div className="p-5">
        <h5 className="mb-2 font-medium text-zinc-900">{title}</h5>
        <p
          className="mb-3 text-xs"
          dangerouslySetInnerHTML={{ "__html": description.slice(0, 80) }}
        ></p>
      </div>  
    </div> 
    
  );
};

export default BlogCard;