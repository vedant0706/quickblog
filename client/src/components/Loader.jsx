import React from "react";

const Loader = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-[#540863]/50 border-[#540863]"></div>
    </div>
  );
};

export default Loader;
