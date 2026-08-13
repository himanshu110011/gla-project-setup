const express = require("express")
const router = express.Router()
const {
    getTransactions,
    createTransaction
} = require("../../Controllers/StockTransactionController/stockTransactionController")

const verifyToken = require("../../Configuration Folders/Middleware Configuration/authMiddleware")

router.get("/transactions", verifyToken, getTransactions)
router.post("/transactions", verifyToken, createTransaction)

module.exports = router
