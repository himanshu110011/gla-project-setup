const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Ensure environment variables are loaded
require("dotenv").config();

async function connectDB() {
    try {
        const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/ProjectDBName";
        await mongoose.connect(mongoURI);
        console.log("MongoDB is connected to:", mongoURI);

        // Auto-seed default values
        await seedDefaultData();
    } catch (error) {
        console.error("Database connection error:", error);
    }
}

async function seedDefaultData() {
    try {
        const User = require("../../Models/UserSchema/user");
        const Category = require("../../Models/CategorySchema/category");
        const Supplier = require("../../Models/SupplierSchema/supplier");
        const Settings = require("../../Models/SettingsSchema/settings");

        // 1. Seed Admin User
        const adminEmail = "admin@inventory.com";
        const adminExists = await User.findOne({ email: adminEmail });
        if (!adminExists) {
            const hashedPassword = await bcrypt.hash("Admin@123", 10);
            await User.create({
                name: "Admin User",
                email: adminEmail,
                password: hashedPassword,
                role: "admin",
                status: "active"
            });
            console.log("Seeded default Admin User: admin@inventory.com / Admin@123");
        }

        // 2. Seed Default Category
        const categoryExists = await Category.findOne({ name: "General" });
        if (!categoryExists) {
            await Category.create({
                name: "General",
                description: "Default Category for general inventory items"
            });
            console.log("Seeded default Category: General");
        }

        // 3. Seed Default Supplier
        const supplierExists = await Supplier.findOne({ name: "Primary Vendor" });
        if (!supplierExists) {
            await Supplier.create({
                name: "Primary Vendor",
                contactPerson: "Account Manager",
                email: "vendor@inventory.com",
                phone: "123-456-7890",
                address: "HQ Distribution Center",
                status: "active"
            });
            console.log("Seeded default Supplier: Primary Vendor");
        }

        // 4. Seed Default Settings
        const settingsCount = await Settings.countDocuments();
        if (settingsCount === 0) {
            await Settings.create({
                companyName: "Inventory Pro",
                globalLowStockThreshold: 10,
                enableLowStockAlerts: true
            });
            console.log("Seeded default Settings");
        }
    } catch (err) {
        console.error("Error seeding default data:", err);
    }
}

module.exports = connectDB;