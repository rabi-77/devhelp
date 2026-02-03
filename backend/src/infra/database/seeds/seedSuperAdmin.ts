import mongoose from "mongoose";
import UserModel from "../models/UserModel";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";

dotenv.config();

const seedSuperAdmin = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            console.error("❌ MONGO_URI not found in environment variables");
            process.exit(1);
        }

        console.log("🔌 Connecting to MongoDB...");
        await mongoose.connect(mongoUri);
        console.log("✅ Connected to MongoDB");

        const superAdminEmail = process.env.SUPER_ADMIN_EMAIL;
        const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD;

        if (!superAdminEmail || !superAdminPassword) {
            console.error("❌ SUPER_ADMIN_EMAIL or SUPER_ADMIN_PASSWORD not found in environment variables");
            console.log("Please add these to your .env file:");
            console.log("SUPER_ADMIN_EMAIL=admin@example.com");
            console.log("SUPER_ADMIN_PASSWORD=your_secure_password");
            process.exit(1);
        }

        // Check if super admin already exists
        const existingSuperAdmin = await UserModel.findOne({
            email: superAdminEmail.toLowerCase(),
            role: "super_admin",
        });

        if (existingSuperAdmin) {
            console.log("ℹ️  Super Admin already exists with email:", superAdminEmail);
            console.log("Updating password...");

            const hashedPassword = await bcrypt.hash(superAdminPassword, 10);
            existingSuperAdmin.password = hashedPassword;
            existingSuperAdmin.status = "active";
            await existingSuperAdmin.save();

            console.log("✅ Super Admin password updated successfully");
        } else {
            console.log("Creating new Super Admin user...");

            const hashedPassword = await bcrypt.hash(superAdminPassword, 10);

            const superAdmin = new UserModel({
                _id: uuidv4(),
                email: superAdminEmail.toLowerCase(),
                password: hashedPassword,
                firstName: "Super",
                lastName: "Admin",
                role: "super_admin",
                status: "active",
                // No companyId for super admin
            });

            await superAdmin.save();
            console.log("✅ Super Admin created successfully");
            console.log("📧 Email:", superAdminEmail);
            console.log("🔑 Password: [hidden]");
        }

        await mongoose.disconnect();
        console.log("✅ Disconnected from MongoDB");
        console.log("\n🎉 Super Admin seed completed successfully!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding Super Admin:", error);
        process.exit(1);
    }
};

seedSuperAdmin();
