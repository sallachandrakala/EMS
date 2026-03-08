import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const cleanupUsers = async () => {
    try {
        // Connect to database
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('Connected to MongoDB');

        // Delete all admin users except one
        const admins = await User.find({ email: 'admin@gmail.com' });
        console.log('Found', admins.length, 'admin users');

        if (admins.length > 1) {
            // Keep the first one, delete the rest
            const [keepUser, ...deleteUsers] = admins;
            
            console.log('Keeping admin:', keepUser._id);
            
            for (const user of deleteUsers) {
                await User.findByIdAndDelete(user._id);
                console.log('Deleted admin:', user._id);
            }
        }

        // Verify final state
        const finalAdmins = await User.find({ email: 'admin@gmail.com' });
        console.log('Final admin count:', finalAdmins.length);

    } catch (error) {
        console.error('Error cleaning up users:', error);
    } finally {
        await mongoose.disconnect();
    }
};

cleanupUsers();
