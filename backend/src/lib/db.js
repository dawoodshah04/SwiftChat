import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI;

export const connectDB = async()=>{
    try {
        const dbconnection = await mongoose.connect(MONGO_URI);
        console.log(`MongoDB connected${dbconnection.connection.host}`)
    } catch (error) {
        console.log('Error in connecting with MongoDB:',error)
        process.exit(1)
    }
}