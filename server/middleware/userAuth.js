import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const userAuth = async (req, res, next) => {
  try {
    const token =
      req.cookies.token ||
      req.headers.authorization?.replace("Bearer ", "") ||
      req.headers.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized. Please login.",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database
    const user = await userModel.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // Attach user info to request
    req.userId = user._id;
    req.userEmail = user.email;
    req.userName = user.name;
    req.isAdmin = user.role === "admin";
    // req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default userAuth;
