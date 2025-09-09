import mongoose from "mongoose";

const Mongo_URL = process.env.MONGODB_URI;

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () =>
      console.log("DataBase Connected):")
    );
    await mongoose.connect(`${Mongo_URL}`);
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
