import React, { useState, useEffect } from "react"
import axios from "axios"
import { BarChart3, Clock, AlertTriangle, ShieldCheck, Download } from "lucide-react"

function Reports() {
    const [logs, setLogs] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const token = localStorage.getItem("Token")

    async function loadLogs() {
        setLoading(true)
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } }
            const response = await axios.get("http://localhost:4000/api/reports/logs", config)
            setLogs(response.data.data)
        } catch (err) {
            console.error("Reports error:", err)
            setError("Could not load system reports.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadLogs()
    }, [])

    const downloadCSV = () => {
        if (logs.length === 0) return
        
        const headers = ["Timestamp", "User Name", "User Email", "Action Performed", "Details"]
        const csvRows = [headers.join(",")]
        
        logs.forEach(log => {
            const row = [
                new Date(log.createdAt).toLocaleString(),
                log.user?.name || "System",
                log.user?.email || "N/A",
                log.action,
                `"${log.details || ''}"`
            ]
            csvRows.push(row.join(","))
        })
        
        const blob = new Blob([csvRows.join("\n")], { type: "text/csv" })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.setAttribute("href", url)
        a.setAttribute("download", `Inventory_Activity_Log_${new Date().toISOString().split('T')[0]}.csv`)
        a.click()
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div className="page-header">
                <div className="page-title-wrap">
                    <h2 style={{ fontSize: "1.5rem" }}>System Analytics & Logs</h2>
                    <span className="page-subtitle">Inspect audit log reports and export CSV activity registers</span>
                </div>
                <button className="btn btn-secondary" onClick={downloadCSV} disabled={logs.length === 0}>
                    <Download size={18} /> Export Log CSV
                </button>
            </div>

            {loading ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "30vh" }}>
                    <div style={{ width: "30px", height: "30px", border: "3px solid var(--border)", borderTopColor: "var(--primary)", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
                </div>
            ) : error ? (
                <div style={{ textAlign: "center", color: "var(--danger)", padding: "20px" }}>{error}</div>
            ) : (
                <div className="glass-panel" style={{ padding: "24px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                        <Clock size={20} style={{ color: "var(--primary)" }} />
                        <h3 style={{ fontSize: "1.1rem", fontWeight: "700" }}>System Activity History</h3>
                    </div>

                    <div className="table-container" style={{ margin: "0" }}>
                        <table className="custom-table">
                            <thead>
                                <tr>
                                    <th>Timestamp</th>
                                    <th>Performed By</th>
                                    <th>Role</th>
                                    <th>Action Type</th>
                                    <th>Action Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.length > 0 ? (
                                    logs.map(log => (
                                        <tr key={log._id}>
                                            <td>{new Date(log.createdAt).toLocaleString()}</td>
                                            <td>
                                                <div style={{ fontWeight: 600 }}>{log.user?.name || "Deleted User"}</div>
                                                <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{log.user?.email}</div>
                                            </td>
                                            <td>
                                                <span className="badge badge-info">{log.user?.role}</span>
                                            </td>
                                            <td>
                                                <span className="badge" style={{ 
                                                    backgroundColor: log.action.includes("DELETE") ? "var(--danger-glow)" : 
                                                                    log.action.includes("CREATE") ? "var(--success-glow)" : 
                                                                    log.action.includes("UPDATE") ? "var(--warning-glow)" : "var(--primary-glow)",
                                                    color: log.action.includes("DELETE") ? "var(--danger)" : 
                                                           log.action.includes("CREATE") ? "var(--success)" : 
                                                           log.action.includes("UPDATE") ? "var(--warning)" : "var(--primary)"
                                                }}>
                                                    {log.action}
                                                </span>
                                            </td>
                                            <td>{log.details}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: "center", color: "var(--text-muted)", padding: "30px" }}>
                                            No system activity logged yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Reports
