import mongoose from "mongoose";
import { config } from "dotenv";
config();

const connectDB = async () => {
  return await mongoose
    .connect(process.env.databaseUrl)
    .then((result) => {
      console.log(`DataBase Connected successfully`);
    })
    .catch((err) => {
      console.log(`Error in connection to DB`, err);
    });
};

export default connectDB;
