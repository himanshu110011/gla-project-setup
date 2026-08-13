import React, { useState, useEffect } from "react"
import axios from "axios"
import { Settings as SettingsIcon, Save, RefreshCw, CheckCircle, AlertTriangle } from "lucide-react"

function Settings() {
    const [settings, setSettings] = useState({
        companyName: "",
        globalLowStockThreshold: 10,
        enableLowStockAlerts: true
    })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState("")
    const [successMsg, setSuccessMsg] = useState("")

    const token = localStorage.getItem("Token")

    async function loadSettings() {
        setLoading(true)
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } }
            const response = await axios.get("http://localhost:4000/api/settings", config)
            setSettings(response.data.data)
        } catch (err) {
            console.error("Settings error:", err)
            setError("Could not load application settings.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadSettings()
    }, [])

    function handleInputChange(e) {
        const val = e.target.type === "checkbox" ? e.target.checked : e.target.value
        setSettings({
            ...settings,
            [e.target.name]: val
        })
    }

    async function handleSaveSettings(e) {
        e.preventDefault()
        setSaving(true)
        setSuccessMsg("")
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } }
            await axios.put("http://localhost:4000/api/settings", settings, config)
            setSuccessMsg("Settings updated successfully!")
            setTimeout(() => setSuccessMsg(""), 3000)
        } catch (err) {
            console.error("Settings save error:", err)
            alert("Error saving settings.")
        } finally {
            setSaving(false)
        }
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div className="page-header">
                <div className="page-title-wrap">
                    <h2 style={{ fontSize: "1.5rem" }}>Global Settings</h2>
                    <span className="page-subtitle">Configure application branding and stock warning threshold definitions</span>
                </div>
            </div>

            {loading ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "30vh" }}>
                    <div style={{ width: "30px", height: "30px", border: "3px solid var(--border)", borderTopColor: "var(--primary)", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
                </div>
            ) : error ? (
                <div style={{ textAlign: "center", color: "var(--danger)", padding: "20px" }}>{error}</div>
            ) : (
                <div className="glass-panel" style={{ padding: "32px", maxWidth: "600px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
                        <SettingsIcon size={22} style={{ color: "var(--primary)" }} />
                        <h3 style={{ fontSize: "1.2rem", fontWeight: "700" }}>System Configuration</h3>
                    </div>

                    {successMsg && (
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            backgroundColor: "var(--success-glow)",
                            color: "var(--success)",
                            padding: "12px 16px",
                            borderRadius: "var(--radius-md)",
                            fontSize: "0.875rem",
                            marginBottom: "24px",
                            border: "1px solid rgba(16, 185, 129, 0.15)",
                            fontWeight: "600"
                        }}>
                            <CheckCircle size={18} />
                            <span>{successMsg}</span>
                        </div>
                    )}

                    <form onSubmit={handleSaveSettings}>
                        <div className="form-group">
                            <label className="form-label">Company Name Branding</label>
                            <input 
                                type="text" 
                                name="companyName" 
                                className="form-input" 
                                placeholder="Inventory Pro" 
                                value={settings.companyName} 
                                onChange={handleInputChange} 
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Global Low-Stock Alert Level Threshold</label>
                            <input 
                                type="number" 
                                name="globalLowStockThreshold" 
                                className="form-input" 
                                value={settings.globalLowStockThreshold} 
                                onChange={handleInputChange} 
                                min="0"
                                required
                            />
                            <span style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                                Default minimum stock level alert trigger used when individual product specifications are omitted.
                            </span>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "24px 0" }}>
                            <input 
                                type="checkbox" 
                                id="enableLowStockAlerts"
                                name="enableLowStockAlerts" 
                                checked={settings.enableLowStockAlerts} 
                                onChange={handleInputChange} 
                                style={{
                                    width: "18px",
                                    height: "18px",
                                    accentColor: "var(--primary)",
                                    cursor: "pointer"
                                }}
                            />
                            <label htmlFor="enableLowStockAlerts" style={{ fontWeight: 600, fontSize: "0.875rem", cursor: "pointer" }}>
                                Enable UI Badges for Low Stock Alerts
                            </label>
                        </div>

                        <button 
                            type="submit" 
                            className="btn btn-primary"
                            disabled={saving}
                            style={{ padding: "12px 20px" }}
                        >
                            {saving ? (
                                <>
                                    <RefreshCw size={16} className="animate-spin" style={{ animation: "spin 1s linear infinite" }} />
                                    <span>Saving Settings...</span>
                                </>
                            ) : (
                                <>
                                    <Save size={16} />
                                    <span>Save Settings</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>
            )}
        </div>
    )
}

export default Settings
