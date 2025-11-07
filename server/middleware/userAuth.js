import jwt from "jsonwebtoken";

const userAuth = (req, res, next) => {
  const { token } = req.cookies;
  
  if (!token) {
    return res.json({ success: false, message: "Not Authorized. Login Again" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if it's admin token (email-based) or user token (userId-based)
    if (decoded.email) {
      // Admin token
      req.isAdmin = true;
      req.email = decoded.email;
      req.userId = decoded.userId || decoded.id; // Some admins might use userId
    } else if (decoded.userId) {
      // Regular user token
      req.isAdmin = false;
      req.userId = decoded.userId;
    } else {
      return res.json({ success: false, message: "Invalid token format" });
    }
    
    next();
  } catch (error) {
    return res.json({ success: false, message: "Invalid token" });
  }
};

export default userAuth;