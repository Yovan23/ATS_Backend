import mongoose from "mongoose";
import { DATABASE_URL } from "../config/config.js";

const connectDB = () => {
  const mongoUrl = DATABASE_URL;
  mongoose.connect(mongoUrl);

  mongoose.connection.once("open", () => {
    console.log("Connected to MongoDB!");
  });
};

export default connectDB;
