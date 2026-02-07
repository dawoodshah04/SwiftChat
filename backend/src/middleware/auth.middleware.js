import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protectRoute = async (req, res, next) => {
    try {
        
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ message: 'Not authorized, token missing' });
        }

        const decoded = jwt.decode(token, process.env.JWT_SECRET);

        if(!decoded){
           return res.status(401).json({message:'Unauthorized, Invalid token'});
        }

        //removes password from client side
        const user = await User.findById(decoded.userId).select("-password");
        if(!user){
            return res.status(400).json({message:'Unauthorized, User not found'})
        }

        req.user = user;
        next();
        } catch (error) {
            console.log('Error in protectRoute Middleware',error);
            res.status(401).json({message:'Internal Server Error'})
        }
}