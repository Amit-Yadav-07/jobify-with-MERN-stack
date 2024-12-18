import mongoose from 'mongoose';

const connectDB = (uri) => {
    mongoose.connect(uri)
}


export default connectDB;