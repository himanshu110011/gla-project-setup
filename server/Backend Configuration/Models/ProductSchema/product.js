const mongoose = require("mongoose")

const productSchema = mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    sku: { type: String, required: true, unique: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, default: 0, min: 0 },
    minStockLevel: { type: Number, required: true, default: 10, min: 0 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier", required: true }
}, { timestamps: true })

module.exports = mongoose.model("Product", productSchema)
