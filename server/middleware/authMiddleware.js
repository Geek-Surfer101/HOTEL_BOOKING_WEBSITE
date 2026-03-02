// filepath: c:\Users\Akshat\OneDrive\Desktop\HotelBooking\server\middleware\authMiddleware.js
import User from "../models/User.js";
// Middleware to check if user is authenticated

export const protect = async (req, res, next) => {
    try {
        const userId = req?.auth?.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "not authenticated" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(401).json({ success: false, message: "user not found" });
        }

        req.user = user;
        next();
    } catch (err) {
        console.error("protect middleware error:", err);
        return res.status(500).json({ success: false, message: "auth middleware error" });
    }
};
