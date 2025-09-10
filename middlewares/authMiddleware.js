import User from "../models/User.js";

//MIDDLEWARE TO CHECK WHETHER USER IS AUTHENTICATED

export const protect = async (req, res, next) => {
  try {
    const { userId } = req.auth; // ← ADD parentheses back - it should be a function call
    
    if (!userId) {
      return res.status(401).json({ success: false, message: "Not Authenticated" });
    }
    
    const user = await User.findById(userId);
    console.log("User found:", user);
    
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found in database" });
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.log("Auth middleware error:", error);
    return res.status(401).json({ success: false, message: "Authentication error" });
  }
};

