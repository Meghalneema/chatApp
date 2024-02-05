const asyncHandler=require("express-async-handler");
const { User } = require("../modules/userModule");
const jwt= require('jsonwebtoken')


const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Log decoded user ID
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded User ID:", decoded.id);

      req.user = await User.findById(decoded.id).select("-password");
      // console.log("User after setting req.user:", req.user);
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});


module.exports = { protect };