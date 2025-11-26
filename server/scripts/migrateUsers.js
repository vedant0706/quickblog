// scripts/migrateUsers.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import userModel from "../models/userModel.js";

dotenv.config();

const migrateUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI + "/quickblog");

    const result = await userModel.updateMany(
      { role: { $exists: false } },
      { $set: { role: "user" } }
    );

    process.exit(0);
  } catch (error) {
    process.exit(1);
  }
};

migrateUsers();
