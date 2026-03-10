import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from '../models/User.js';

const createUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/ems');
    console.log('Connected to MongoDB');

    // Users to create
    const users = [
      {
        name: 'Chandrakala Salla',
        email: 'chandrakalasalla12@gmail.com',
        password: 'kala',
        role: 'admin'
      },
      {
        name: 'John Doe',
        email: 'john.doe@company.com',
        password: 'password123',
        role: 'employee'
      },
      {
        name: 'Jane Smith',
        email: 'jane.smith@company.com',
        password: 'password123',
        role: 'employee'
      },
      {
        name: 'Robert Johnson',
        email: 'robert.johnson@company.com',
        password: 'password123',
        role: 'employee'
      }
    ];

    // Clear existing users (optional - comment out if you want to keep existing users)
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Create new users
    for (const userData of users) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = new User({
        ...userData,
        password: hashedPassword
      });
      await user.save();
      console.log(`Created user: ${userData.email}`);
    }

    console.log('All users created successfully!');
    console.log('Login credentials:');
    console.log('1. Chandrakala Salla (Admin) - chandrakalasalla12@gmail.com / kala');
    console.log('2. John Doe (Employee) - john.doe@company.com / password123');
    console.log('3. Jane Smith (Employee) - jane.smith@company.com / password123');
    console.log('4. Robert Johnson (Employee) - robert.johnson@company.com / password123');

  } catch (error) {
    console.error('Error creating users:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

createUsers();
