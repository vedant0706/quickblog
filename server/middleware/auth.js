// import jwt from "jsonwebtoken";

// export const userAuth = async (req, res, next) => {
//   const { token } = req.cookies;

//   if (!token) {
//     return res.json({ success: false, message: "Not Authorized. Login Again" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.userId = decoded.userId;
//     next();
//   } catch (error) {
//     return res.json({ success: false, message: 'Invalid token'});
//   }
// };