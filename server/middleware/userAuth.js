import jwt from "jsonwebtoken"

const auth = (req, res, next) => {
    const token = req.headers.authorization || req.cookies.token;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Check if it's admin token (email-based) or user token (userId-based)
        if (decoded.email) {
            req.isAdmin = true;
            req.email = decoded.email;
        } else if (decoded.userId) {
            req.isAdmin = false;
            req.userId = decoded.userId;
        }
        
        next();
    } catch (error) {
        res.json({ success: false, message: "Invalid token" })
    }
}

export default auth;