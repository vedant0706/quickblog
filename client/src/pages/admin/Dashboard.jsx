import React, { useEffect, useState } from "react";
import BlogTableItem from "../../components/admin/BlogTableItem";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { RiCheckboxMultipleFill } from "react-icons/ri";
import { LiaComments } from "react-icons/lia";
import { MdOutlineDrafts } from "react-icons/md";
import { MdOutlineRecentActors } from "react-icons/md";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    blogs: 0,
    comments: 0,
    drafts: 0,
    recentBlogs: [],
  });

  const { axios, userData } = useAppContext();

  const fetchDashboard = async () => {
    try {
      const endpoint =
        userData?.role === "admin"
          ? "/api/admin/dashboard"
          : "/api/blog/my-dashboard";

      const { data } = await axios.get(endpoint);

      if (data.success) {
        setDashboardData(data.dashboardData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (userData) {
      fetchDashboard();
    }
  }, [userData]);

  return (
    <div className="flex-1 p-4 md:p-10 bg-[#112D4E]/1 ">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-black">
          {userData?.role === "admin" ? "Admin Dashboard" : "My Dashboard"}
        </h1>
        {userData?.role === "admin" ? (
          <p className="text-sm text-gray-600 mt-1">
            Managing all blogs and comments
          </p>
        ) : (
          <p className="text-sm text-gray-600 mt-1">
            Overview of your blogs and activity
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-4 bg-white p-4 min-w-58 rounded shadow cursor-pointer hover:scale-105 transition-all ">
          <span className="text-[#540863] text-2xl bg-[#540863]/20 p-2">
            <RiCheckboxMultipleFill />
          </span>
          <div>
            <p className="text-xl font-semibold text-black">
              {dashboardData.blogs}
            </p>
            <p className="text-gray-700 font-light">
              {userData?.role === "admin" ? "Total Blogs" : "My Blogs"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white p-4 min-w-58 rounded shadow cursor-pointer hover:scale-105 transition-all ">
          <span className="text-[#540863] text-2xl bg-[#540863]/20 p-2">
            <LiaComments />
          </span>
          <div>
            <p className="text-xl font-semibold text-black">
              {dashboardData.comments}
            </p>
            <p className="text-gray-700 font-light">
              {userData?.role === "admin"
                ? "All Comments"
                : "Comments on My Blogs"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white p-4 min-w-58 rounded shadow cursor-pointer hover:scale-105 transition-all ">
          <span className="text-[#540863] text-2xl bg-[#540863]/20 p-2">
            <MdOutlineDrafts />
          </span>
          <div>
            <p className="text-xl font-semibold text-black">
              {dashboardData.drafts}
            </p>
            <p className="text-gray-700 font-light">
              {userData?.role === "admin" ? "All Drafts" : "My Drafts"}
            </p>
          </div>
        </div>

        {/* Show pending approval count for admin */}
        {userData?.role === "admin" &&
          dashboardData.pendingApproval !== undefined && (
            <div className="flex items-center gap-4 bg-yellow-50 border border-yellow-200 p-4 min-w-58 rounded shadow cursor-pointer hover:scale-105 transition-all ">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">⏳</span>
              </div>
              <div>
                <p className="text-xl font-semibold text-black">
                  {dashboardData.pendingApproval}
                </p>
                <p className="text-gray-700 font-light">Pending Approval</p>
              </div>
            </div>
          )}
      </div>

      <div>
        <div className="flex items-center gap-3 m-4 mt-6 text-black">
          <span className="text-2xl text-[#540863]">
            <MdOutlineRecentActors />
          </span>
          <p>
            {userData?.role === "admin" ? "Latest Blogs" : "My Recent Blogs"}
          </p>
        </div>

        {dashboardData.recentBlogs.length === 0 ? (
          <div className="text-center py-10 text-gray-500 bg-white rounded-lg shadow">
            <p>
              {userData?.role === "admin"
                ? "No blogs yet. Users will create blogs soon!"
                : "No blogs yet. Create your first blog to get started!"}
            </p>
          </div>
        ) : (
          <div className="relative max-w-4xl overflow-x-auto shadow rounded-lg scrollbar-hide bg-[white]">
            <table className="w-full text-sm text-gray-900">
              <thead className="text-xs text-gray-600 text-left uppercase">
                <tr className="text-black">
                  <th scope="col" className="px-2 py-4 xl:px-6">
                    #
                  </th>
                  <th scope="col" className="px-2 py-4">
                    Blog Title
                  </th>
                  <th scope="col" className="px-2 py-4 max-sm:hidden">
                    Date
                  </th>
                  <th scope="col" className="px-2 py-4 max-sm:hidden">
                    Status
                  </th>
                  <th scope="col" className="px-2 py-4">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.recentBlogs.map((blog, index) => {
                  return (
                    <BlogTableItem
                      key={blog._id}
                      blog={blog}
                      fetchBlogs={fetchDashboard}
                      index={index + 1}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
