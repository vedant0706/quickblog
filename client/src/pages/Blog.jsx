import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { assets } from "../assets/Assets.jsx";
import Navbar from "../components/Navbar";
import Moment from "moment";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { FaGoogle, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Blog = () => {
  const { id } = useParams();

  const { axios } = useAppContext();

  const [data, setData] = useState(null);
  const [comments, setComments] = useState([]);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");

  //  const authorName =
  // typeof data.authorId === "string"
  //   ? "Unknown Author"
  //   : data.authorId?.name || "Unknown Author";

  const fetchBlogData = async () => {
    try {
      const { data } = await axios.get(`/api/blog/${id}`);
      data.success ? setData(data.blog) : toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchComments = async () => {
    try {
      const { data } = await axios.post("/api/blog/comments", { blogId: id });
      if (data.success) {
        setComments(data.comments);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const addComment = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/blog/add-comment", {
        blog: id,
        name,
        content,
      });
      if (data.success) {
        toast.success(data.message);
        setName("");
        setContent("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchBlogData();
    fetchComments();
  }, []);

  return data ? (
    <div className="mt-20">
      <Navbar />

      <div className="text-center text-zinc-900">
        <p className="py-4 font-semibold">
          <span className="shadow-xs shadow-[#828080]">
            Published on {Moment(data.createdAt).format("MMMM Do YYYY")}
          </span>
        </p>
        <h1 className="text-2xl sm:text-5xl font-semibold max-w-2xl mx-auto leading-14 text-[#540863]">
          {data.title}
        </h1>
        <h2 className="my-5 max-w-lg font-semibold text-zinc-900 truncate mx-auto">
          {data.subTitle}
        </h2>

        <p className="inline-block py-1 px-4 rounded-full mb-6 border text-sm border-[#540863]/60 bg-[#540863]/30 font-medium text-black">
          {/* Michael Brown */}
          
  {data?.authorId && typeof data.authorId !== "string"
    ? data.authorId.name
    : "Unknown Author"}

        </p>
      </div>

      <div className="max-5 max-w-5xl md:mx-auto my-10 mt-6">
        <img src={data.image} className="rounded-3xl mb-5" />

        <div
          className="rich-text max-w-3xl mx-auto"
          dangerouslySetInnerHTML={{ __html: data.description }}
        ></div>

        {/* Comments Section */}
        <div className="mt-14 mb-10 max-w-3xl mx-auto">
          <p className="font-semibold mb-4">Comments ({comments.length})</p>
          <div className="flex flex-col gap-4">
            {comments.map((item, index) => (
              <div
                key={index}
                className="relative bg-[#F9F7F7] border border-gray-700 max-w-xl p-4 rounded text-zinc-600"
              >
                <div className="flex items-center gap-2 mb-2">
                  <img src={assets.user_icon} alt="" className="w-6" />
                  <p className="font-semibold">{item.name}</p>
                </div>
                <p className="text-sm mx-w-md ml-8">{item.content}</p>
                <div className="absolute right-4 bottom-3 flex items-center gap-2 text-xs">
                  {Moment(item.createdAt).fromNow()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Comment Section */}
        <div className="max-w-3xl mx-auto">
          <p className="font-semibold mb-4">Add your comment</p>
          <form
            onSubmit={addComment}
            className="flex flex-col items-start gap-4 max-w-lg"
          >
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              type="text"
              placeholder="Name"
              className="w-full p-2 border border-zinc-800 text-black rounded outline-none"
              required
            />

            <textarea
              onChange={(e) => setContent(e.target.value)}
              value={content}
              placeholder="Comment"
              className="w-full p-2 border border-zinc-800 text-black rounded outline-none h-48"
              required
            ></textarea>

            <button
              type="submit"
              className="bg-[#540863] text-white rounded p-2 px-8 hover:scale-102 transition-all cursor-pointer"
            >
              Submit
            </button>
          </form>
        </div>

        {/* Share Buttons */}
        <div className="my-24 max-w-3xl mx-auto">
          <p className="font-semibold my-4">
            Share this article on social media
          </p>
          <div className="flex flex-row gap-4 text-3xl">
            <Link
              to="https://google.com"
              target="_blank"
              className="hover:border-2 hover:p-1.5 hover:rounded-full"
            >
              <FaGoogle />
            </Link>
            <Link
              to="https://x.com"
              target="_blank"
              className="hover:border-2 hover:p-1.5 hover:rounded-full"
            >
              <FaXTwitter />
            </Link>
            <Link
              to="https://instagram.com"
              target="_blank"
              className="hover:border-2 hover:p-1.5 hover:rounded-full"
            >
              <FaInstagram />
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  ) : (
    <Loader />
  );
};

export default Blog;