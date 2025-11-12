import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const seedAdmin = async () => {
  await mongoose.connect(process.env.MONGODB_URI + '/quickblog');
  
  const admin = await User.findOne({ email: process.env.ADMIN_EMAIL });
  if (admin) {
    console.log('Admin already exists');
    process.exit();
  }

  const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
  await User.create({
    name: 'Admin',
    email: process.env.ADMIN_EMAIL,
    password: hashed,
    role: 'admin',
    isAccountVerified: true
  });

  console.log('Admin created!');
  process.exit();
};

seedAdmin();