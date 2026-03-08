import mongoose from 'mongoose';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const resetAdminPassword = async () => {
    try {
        // Connect to database
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('Connected to MongoDB');

        // Find admin user
        const admin = await User.findOne({ email: 'admin@gmail.com' });
        
        if (!admin) {
            console.log('Admin user not found');
            return;
        }

        console.log('Found admin user:', admin.name);

        // Hash new password
        const newPassword = 'admin123';
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        console.log('New password hashed');

        // Update password
        await User.findByIdAndUpdate(admin._id, { password: hashedPassword });
        console.log('Password updated successfully');

        // Verify the update
        const updatedAdmin = await User.findById(admin._id);
        const isMatch = await bcrypt.compare(newPassword, updatedAdmin.password);
        console.log('Password verification:', isMatch ? 'Success' : 'Failed');

        console.log('Admin credentials:');
        console.log('Email:', admin.email);
        console.log('Password:', newPassword);

    } catch (error) {
        console.error('Error resetting password:', error);
    } finally {
        await mongoose.disconnect();
    }
};

resetAdminPassword();
