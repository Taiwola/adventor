const mongoose = require('mongoose');

const inProduction = process.env.NOV_ENV === 'production';

const connectDB = async () => {
    mongoose.set('strictQuery', true)
    try {
        await mongoose.connect(process.env.MONGODB_URL );
    } catch(error) {
        console.log(error);
        console.log('we have an error');
    }
}

module.exports = connectDB;