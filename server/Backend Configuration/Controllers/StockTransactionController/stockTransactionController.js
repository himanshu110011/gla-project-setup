const StockTransaction = require("../../Models/StockTransactionSchema/stockTransaction")
const Product = require("../../Models/ProductSchema/product")
const ActivityLog = require("../../Models/ActivityLogSchema/activityLog")

// Get all transactions
const getTransactions = async (req, res) => {
    try {
        const transactions = await StockTransaction.find()
            .populate({
                path: "product",
                select: "name sku category",
                populate: { path: "category", select: "name" }
            })
            .populate("performedBy", "name email")
            .sort({ createdAt: -1 })

        res.status(200).json({ data: transactions })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Create stock transaction (stock-in / stock-out)
const createTransaction = async (req, res) => {
    try {
        const { product: productId, type, quantity, reason } = req.body
        const userId = req.user.id

        if (!productId || !type || !quantity) {
            return res.status(400).json({ message: "Product, type, and quantity are required" })
        }

        if (!["stock-in", "stock-out"].includes(type)) {
            return res.status(400).json({ message: "Invalid transaction type" })
        }

        const product = await Product.findById(productId)
        if (!product) {
            return res.status(404).json({ message: "Product not found" })
        }

        const qtyNum = Number(quantity)
        if (qtyNum <= 0) {
            return res.status(400).json({ message: "Quantity must be greater than zero" })
        }

        // Validate stock-out limit
        if (type === "stock-out" && product.quantity < qtyNum) {
            return res.status(400).json({ 
                message: `Insufficient stock. Current stock is ${product.quantity}, but requested ${qtyNum}.` 
            })
        }

        // Update product quantity
        if (type === "stock-in") {
            product.quantity += qtyNum
        } else {
            product.quantity -= qtyNum
        }

        await product.save()

        // Create transaction log
        const transaction = new StockTransaction({
            product: productId,
            type,
            quantity: qtyNum,
            reason,
            performedBy: userId
        })

        await transaction.save()

        // Log system activity
        await ActivityLog.create({
            user: userId,
            action: `STOCK_${type.toUpperCase().replace("-", "_")}`,
            details: `Logged ${type} of ${qtyNum} units for product ${product.name} (Reason: ${reason || "N/A"})`
        })

        res.status(201).json({ 
            message: `Stock ${type === "stock-in" ? "added" : "removed"} successfully`, 
            data: transaction 
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = {
    getTransactions,
    createTransaction
}
