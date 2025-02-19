/* Backend - db.js */
import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://mansiunge842:JgKvHZZg0zn5gZp9@cluster0.ynzx7.mongodb.net/data?retryWrites=true&w=majority&appName=Cluster0");
        console.log("MongoDB Connected");
    } catch (error) {
        console.error("MongoDB Connection Failed", error);
        process.exit(1);
    }
};

export default connectDB;
