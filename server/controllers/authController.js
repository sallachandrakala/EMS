import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                error: "Email and password are required"
            });
        }
        
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                error: "User Not Found"
            });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return res.status(401).json({ 
                success: false, 
                error: "Wrong Password"
            });
        }
        
        const token = jwt.sign(
            { _id: user._id, role: user.role },
            process.env.JWT_KEY,
            { expiresIn: "10d" }
        );
        
        res.status(200).json({
            success: true,
            token,
            user: { 
                _id: user._id, 
                name: user.name, 
                role: user.role 
            },
        });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            error: "Server Error"
        });
    }
};

export const verify = (req, res) => {
    return res.status(200).json({ success: true, user: req.user })
}