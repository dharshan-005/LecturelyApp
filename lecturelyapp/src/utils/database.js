import mongoose from 'mongoose';

let isConnected = false;

export const connectToDB = async () => {
    mongoose.set('strictQuery', true);
  if (isConnected) {
    console.log('Already connected to the database.');
    return;
  }

  try {
    await mongoose.connect('mongodb://localhost:27017/LecturelyDB')

    isConnected = true;
    console.log('Connected to the database.');
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
}