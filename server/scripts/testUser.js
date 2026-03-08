import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const testUser = async () => {
    try {
        // Connect to database
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('Connected to MongoDB');

        // Check if admin exists
        const admin = await User.findOne({ email: 'admin@gmail.com' });
        console.log('Admin user:', admin ? 'Found' : 'Not found');
        
        if (admin) {
            console.log('Admin details:', {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            });
        }

        // List all users
        const allUsers = await User.find({});
        console.log('Total users in database:', allUsers.length);
        
        allUsers.forEach((user, index) => {
            console.log(`User ${index + 1}:`, {
                name: user.name,
                email: user.email,
                role: user.role
            });
        });

    } catch (error) {
        console.error('Error testing user:', error);
    } finally {
        await mongoose.disconnect();
    }
};

testUser();
