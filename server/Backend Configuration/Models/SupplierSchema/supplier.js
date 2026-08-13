const mongoose = require("mongoose")

const supplierSchema = mongoose.Schema({
    name: { type: String, required: true },
    contactPerson: { type: String },
    email: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
    status: { type: String, enum: ["active", "inactive"], default: "active" }
}, { timestamps: true })

module.exports = mongoose.model("Supplier", supplierSchema)
