const mongoose = require("mongoose")

const stockTransactionSchema = mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    type: { type: String, enum: ["stock-in", "stock-out"], required: true },
    quantity: { type: Number, required: true, min: 1 },
    reason: { type: String },
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true })

module.exports = mongoose.model("StockTransaction", stockTransactionSchema)
