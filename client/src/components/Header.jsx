import React, { useRef } from "react";
import { assets } from "../assets/Assets.jsx";
import { useAppContext } from "../context/AppContext";

const Header = () => {
  const { setInput, input } = useAppContext();
  const inputRef = useRef();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setInput(inputRef.current.value);
  };

  const onClear = () => {
    setInput("");
    inputRef.current.value = "";
  };

  return (
    <div>
      <div className="mx-8 sm:mx-16 xl:mx-24 relative bg-[#F9F7F7]">
        <div className="text-center mt-20 mb-8">
          <div className="inline-flex items-center justify-center gap-4 px-6 py-1.5 mb-4 border-none text-white bg-[#540863]/90 shadow-2xl shadow-[#540863] rounded-full text-sm ">
            <p className="">New: AI feature integrated</p>
          </div>

          <h1 className="text-3xl sm:text-6xl font-semibold text-zinc-900">
            Your Personal <span className="text-[#540863]">Publishing</span>
            <br />
            Hub.
          </h1>
          <p className="my-6 sm:my-8 max-w-2xl m-auto max-sm:text-xs text-zinc-900">
            Write freely, think deeply, share boldly. This is your corner of the
            internet where every idea counts, every story deserves to be told,
            and nothing is off-limits.
          </p>

          <form
            onSubmit={onSubmitHandler}
            className="flex justify-between max-w-lg max-sm:scale-75 mx-auto border-2 border-black text-black rounded overflow-hidden"
          >
            <input
              ref={inputRef}
              type="text"
              placeholder="Search for blogs"
              required
              className="w-full pl-4 outline-none text-black font-medium"
            />
            <button
              type="submit"
              className="text-white bg-[#540863] px-8 py-2 m-1.5 rounded hover:scale-105 transition-all cursor-pointer"
            >
              Search
            </button>
          </form>
        </div>

        <div className="text-center">
          {input && (
            <button
              onClick={onClear}
              className="border border-none bg-[#540863] text-white font-medium text-sm py-1 px-3 rounded-sm shadow-custom-sm cursor-pointer"
            >
              Clear Search
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;