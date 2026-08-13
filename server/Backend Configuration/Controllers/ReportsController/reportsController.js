const Product = require("../../Models/ProductSchema/product")
const Category = require("../../Models/CategorySchema/category")
const Supplier = require("../../Models/SupplierSchema/supplier")
const StockTransaction = require("../../Models/StockTransactionSchema/stockTransaction")
const ActivityLog = require("../../Models/ActivityLogSchema/activityLog")

// Get dashboard summary stats
const getDashboardStats = async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments()
        const totalCategories = await Category.countDocuments()
        const totalSuppliers = await Supplier.countDocuments()

        // Calculate total inventory value and total items
        const stockAggregate = await Product.aggregate([
            {
                $group: {
                    _id: null,
                    totalValue: { $sum: { $multiply: ["$price", "$quantity"] } },
                    totalStock: { $sum: "$quantity" }
                }
            }
        ])

        const totalValue = stockAggregate[0]?.totalValue || 0
        const totalStock = stockAggregate[0]?.totalStock || 0

        // Find alert levels
        // 1. Low stock: 0 < quantity <= minStockLevel
        const lowStockCount = await Product.countDocuments({
            $and: [
                { quantity: { $gt: 0 } },
                { $expr: { $lte: ["$quantity", "$minStockLevel"] } }
            ]
        })

        // 2. Out of stock: quantity === 0
        const outOfStockCount = await Product.countDocuments({ quantity: 0 })

        // Category distribution (for pie/bar charts)
        const categoryDistribution = await Product.aggregate([
            {
                $group: {
                    _id: "$category",
                    productCount: { $sum: 1 },
                    stockCount: { $sum: "$quantity" }
                }
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "_id",
                    foreignField: "_id",
                    as: "categoryDetails"
                }
            },
            {
                $unwind: "$categoryDetails"
            },
            {
                $project: {
                    _id: 1,
                    name: "$categoryDetails.name",
                    productCount: 1,
                    stockCount: 1
                }
            }
        ])

        // Recent stock transactions (last 7 transactions)
        const recentTransactions = await StockTransaction.find()
            .populate("product", "name sku")
            .populate("performedBy", "name")
            .sort({ createdAt: -1 })
            .limit(7)

        res.status(200).json({
            data: {
                totalProducts,
                totalCategories,
                totalSuppliers,
                totalValue,
                totalStock,
                lowStockCount,
                outOfStockCount,
                categoryDistribution,
                recentTransactions
            }
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Get activity logs (Admin only)
const getActivityLogs = async (req, res) => {
    try {
        const logs = await ActivityLog.find()
            .populate("user", "name email role")
            .sort({ createdAt: -1 })
            .limit(100) // limit to recent 100 entries

        res.status(200).json({ data: logs })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = {
    getDashboardStats,
    getActivityLogs
}
