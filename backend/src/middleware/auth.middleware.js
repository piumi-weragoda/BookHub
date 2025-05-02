import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const protectRoute = async (req, res, next) => {

    try {

        //NOTE - get token from the request header

        const token = req.header("Authorization").replace("Bearer ", "");
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        //NOTE - verify the token   
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        //NOTE - find the user by id
        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        req.user = user;
        next();
    } catch (error) {

        console.log("Authentication error:", error.message);
        res.status(401).json({ message: "Token is not valid" });
        
    }

};
export default protectRoute;
//NOTE - this middleware function is used to protect the routes that require authentication