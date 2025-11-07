import jwt from "jsonwebtoken";

const adminAuth = (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.json({ success: false, message: "Not Authorized. Login Again" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if it's admin token (you can use email or isAdmin flag)
    if (decoded.email) {
      // Admin token contains email
      req.email = decoded.email;
      req.isAdmin = true;
      next();
    } else {
      return res.json({ success: false, message: "Admin access required" });
    }
  } catch (error) {
    return res.json({ success: false, message: "Invalid token" });
  }
};

export default adminAuth;