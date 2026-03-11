import mongoose from 'mongoose';

const testMongoConnection = async () => {
    try {
        console.log('🔄 Testing MongoDB connection...');
        
        // Connect to MongoDB
        await mongoose.connect('mongodb://localhost:27017/ems', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log('✅ MongoDB connected successfully');
        
        // Test basic operations
        const db = mongoose.connection.db;
        
        // List collections
        const collections = await db.listCollections().toArray();
        console.log('📁 Collections found:', collections.map(c => c.name));
        
        // Test employee collection
        if (collections.find(c => c.name === 'employees')) {
            const employeeCount = await db.collection('employees').countDocuments();
            console.log(`👥 Employees collection has ${employeeCount} documents`);
            
            // Try to fetch a few documents
            const employees = await db.collection('employees').find({}).limit(3).toArray();
            console.log('📋 Sample employees:', employees.map(e => ({ id: e._id, name: e.name, employeeId: e.employeeId })));
        }
        
        await mongoose.disconnect();
        console.log('✅ Test completed successfully');
        
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error.message);
        process.exit(1);
    }
};

testMongoConnection();
