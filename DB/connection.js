import mongoose from "mongoose";

const connectDB = async () => {
  return await mongoose
    .connect("mongodb://localhost:27017/pos")
    .then((result) => {
      console.log(`DataBase Connected successfully`);
    })
    .catch((err) => {
      console.log(`Error in connection to DB`, err);
    });
};

export default connectDB;
