import mongoose from "mongoose";

export const connectDatabase = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/devHelp";

    await mongoose.connect(mongoUri);

    console.log("MongoDB connected successfully");
  } catch (_) {
    console.error("MongoDB connection error");
    process.exit(1);
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

mongoose.connection.on("error", (err) => {
  console.log("MongoDB error", err);
});
