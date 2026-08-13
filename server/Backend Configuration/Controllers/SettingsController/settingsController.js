const Settings = require("../../Models/SettingsSchema/settings")
const ActivityLog = require("../../Models/ActivityLogSchema/activityLog")

// Get global settings
const getSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne()
        if (!settings) {
            settings = new Settings()
            await settings.save()
        }
        res.status(200).json({ data: settings })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Update settings (Admin only)
const updateSettings = async (req, res) => {
    try {
        const { companyName, globalLowStockThreshold, enableLowStockAlerts } = req.body
        const userId = req.user.id

        let settings = await Settings.findOne()
        if (!settings) {
            settings = new Settings()
        }

        if (companyName !== undefined) settings.companyName = companyName
        if (globalLowStockThreshold !== undefined) settings.globalLowStockThreshold = globalLowStockThreshold
        if (enableLowStockAlerts !== undefined) settings.enableLowStockAlerts = enableLowStockAlerts

        await settings.save()

        // Log system activity
        await ActivityLog.create({
            user: userId,
            action: "SETTINGS_UPDATE",
            details: `Updated company settings: ${settings.companyName}`
        })

        res.status(200).json({ message: "Settings updated successfully", data: settings })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = {
    getSettings,
    updateSettings
}
