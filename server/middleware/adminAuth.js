import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const adminAuth = async (req, res, next) => {
  try {
    // Check for token in both cookies and headers
    let token = req.cookies.token;

    if (!token && req.headers.authorization) {
      token = req.headers.authorization.replace("Bearer ", "");
    }

    if (!token && req.headers.token) {
      token = req.headers.token;
    }

    if (!token) {
      return res.json({
        success: false,
        message: "Not Authorized. Login Again",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database to verify admin role
    const user = await userModel.findById(decoded.userId);

    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    // Check if user is admin
    if (user.role !== "admin") {
      return res.json({
        success: false,
        message: "Admin access required. You don't have permission.",
      });
    }

    // Attach admin info to request
    req.userId = user._id;
    req.userEmail = user.email;
    req.userName = user.name;
    req.isAdmin = true;
    req.user = user;

    next();
  } catch (error) {
    return res.json({
      success: false,
      message: "Invalid token",
    });
  }
};

export default adminAuth;
