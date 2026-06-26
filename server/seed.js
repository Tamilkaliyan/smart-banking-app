import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import User from './models/User.js';
import mongoose from 'mongoose';

dotenv.config();

async function seed() {
  await connectDB();

  const existing = await User.findOne({ role: 'admin' });
  if (existing) {
    console.log('Admin already exists:', existing.email);
  } else {
    const admin = await User.create({
      name: 'Bank Admin',
      email: 'admin@smartbank.com',
      passwordHash: 'admin123', // hashed automatically by the User model
      role: 'admin'
    });
    console.log('✅ Admin created:', admin.email, '(password: admin123)');
  }

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
