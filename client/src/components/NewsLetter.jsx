
import React from "react";

const NewsLetter = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-2 my-32">
      <h1 className="md:text-4xl text-2xl font-semibold text-zinc-900">
        Never miss a blog!
      </h1>
      <p className="md:text-lg pb-8 text-zinc-700">
        Subscribe to get the latest blog, new tech, and exclusive news.
      </p>

      <form className="flex w-full justify-between max-w-lg max-sm:scale-75 mx-auto border-2 border-black text-black rounded overflow-hidden">
        <input
          type="email"
          placeholder="Enter your email id"
          required
          className="w-full pl-4 outline-none text-black font-medium"
        />
        <button
          type="submit"
          className="bg-primary text-white bg-[#540863] px-8 py-2 m-1.5 rounded hover:scale-105 transition-all cursor-pointer"
          // required
        >
          Subscribe
        </button>
      </form>
    </div>
  );
};

export default NewsLetter;
