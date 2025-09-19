import mongoose from 'mongoose';

let isConnected = false;

export async function connectMongo(uri: string) {
  if (isConnected) return;

  if (!uri) {
    throw new Error('MONGODB_URI is not set');
  }

  mongoose.set('strictQuery', true);

  await mongoose.connect(uri);
  isConnected = true;
  console.log('MongoDB connected');
}