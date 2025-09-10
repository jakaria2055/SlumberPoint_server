import user from "../models/User.js";

//MIDDLEWARE TO CHECK WHETHER USER IS AUTHENTICATED

export const protect = async (req, res, next) => {
  const { userId } = req.auth;
  if (!userId) {
    res.json({ success: false, message: "Not Authenticated" });
  } else {
    const user = await user.findById(userId);
    req.user = user;
    next();
  }
};
