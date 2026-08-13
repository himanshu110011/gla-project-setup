const express = require("express")
const router = express.Router()
const {
    getDashboardStats,
    getActivityLogs
} = require("../../Controllers/ReportsController/reportsController")

const verifyToken = require("../../Configuration Folders/Middleware Configuration/authMiddleware")
const authorize = require("../../Configuration Folders/Middleware Configuration/roleSpecificMiddleware")

router.get("/reports/dashboard", verifyToken, getDashboardStats)
router.get("/reports/logs", verifyToken, authorize("admin"), getActivityLogs)

module.exports = router
