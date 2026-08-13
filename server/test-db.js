const mongoose = require("mongoose");
const connectDB = require("./Backend Configuration/Configuration Folders/DB Configuration/dbCofig");

async function runTest() {
    try {
        console.log("Starting DB Connection test...");
        await connectDB();
        
        const User = require("./Backend Configuration/Models/UserSchema/user");
        const Category = require("./Backend Configuration/Models/CategorySchema/category");
        const Supplier = require("./Backend Configuration/Models/SupplierSchema/supplier");
        
        const admins = await User.find({ role: "admin" });
        console.log("Seeded admins count:", admins.length);
        if (admins.length > 0) {
            console.log("Seeded Admin Email:", admins[0].email);
        }

        const categories = await Category.find();
        console.log("Seeded categories count:", categories.length);

        const suppliers = await Supplier.find();
        console.log("Seeded suppliers count:", suppliers.length);

        console.log("DB Test Passed Successfully!");
        await mongoose.connection.close();
        process.exit(0);
    } catch (err) {
        console.error("DB Test Failed:", err);
        process.exit(1);
    }
}

runTest();
