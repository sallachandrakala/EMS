import mongoose from 'mongoose';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const testLogin = async () => {
    try {
        // Connect to database
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('Connected to MongoDB');

        // Test login with admin credentials
        const email = 'admin@gmail.com';
        const password = 'admin123';

        console.log('Testing login with:', email);

        // Find user
        const user = await User.findOne({ email });
        console.log('User found:', user ? 'Yes' : 'No');

        if (!user) {
            console.log('ERROR: User not found');
            return;
        }

        console.log('User details:', {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            hasPassword: !!user.password
        });

        // Test password comparison
        console.log('Testing password comparison...');
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password match:', isMatch);

        if (!isMatch) {
            console.log('ERROR: Password does not match');
            return;
        }

        // Test token generation
        console.log('Testing token generation...');
        console.log('JWT_KEY exists:', !!process.env.JWT_KEY);
        
        const token = jwt.sign(
            { _id: user._id, role: user.role },
            process.env.JWT_KEY,
            { expiresIn: "10d" }
        );
        console.log('Token generated successfully:', token ? 'Yes' : 'No');

        console.log('Login test completed successfully!');

    } catch (error) {
        console.error('Error testing login:', error);
    } finally {
        await mongoose.disconnect();
    }
};

testLogin();
