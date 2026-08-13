const express = require("express")
const router = express.Router()
const {
    getSettings,
    updateSettings
} = require("../../Controllers/SettingsController/settingsController")

const verifyToken = require("../../Configuration Folders/Middleware Configuration/authMiddleware")
const authorize = require("../../Configuration Folders/Middleware Configuration/roleSpecificMiddleware")

router.get("/settings", verifyToken, getSettings)
router.put("/settings", verifyToken, authorize("admin"), updateSettings)

module.exports = router
