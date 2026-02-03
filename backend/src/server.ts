import dotenv from "dotenv";
dotenv.config();
import app from "./app";
import { connectDatabase } from "./infra/database/connection";
import { runSeeds } from "./infra/database/seeds";

const PORT = process.env.PORT;

const startServer = async () => {
  try {
    await connectDatabase();
    await runSeeds();

    app.listen(PORT, () => {
      console.log(` Server is running on port ${PORT}`);
      console.log(` API: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

const requiredEnvVars = [
  "MONGO_URI",
  "JWT_SECRET",
  "JWT_REFRESH_SECRET",
  "JWT_EXPIRES_IN",
  "JWT_REFRESH_EXPIRES_IN",
  "BCRYPT_SALT_ROUNDS",
  "MAIL_USER",
  "MAIL_PASSWORD",
  "NODE_ENV",
  "SUPER_ADMIN_EMAIL",
  "SUPER_ADMIN_PASSWORD",
];

requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    console.error(`Missing required environment variable: ${varName}`);
    process.exit(1);
  }
});

console.log("All required environment variables are set");

startServer();
