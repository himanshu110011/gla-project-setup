const mongoose = require("mongoose")

const settingsSchema = mongoose.Schema({
    companyName: { type: String, default: "Inventory Pro" },
    globalLowStockThreshold: { type: Number, default: 10 },
    enableLowStockAlerts: { type: Boolean, default: true }
}, { timestamps: true })

module.exports = mongoose.model("Settings", settingsSchema)
