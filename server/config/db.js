const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try { 
        const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/notes_app';
        console.log('Attempting to connect to MongoDB...');
        
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(' MongoDB connected successfully');
    } catch (err) {
        console.error(' MongoDB connection failed:', err.message);
        console.log('Please make sure MongoDB is running and accessible');
        process.exit(1);
    }
};

module.exports = connectDB;