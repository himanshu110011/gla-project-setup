import React, { useState, useEffect } from "react"
import axios from "axios"
import { AlertTriangle, ShieldCheck, HelpCircle } from "lucide-react"

function Alerts() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const token = localStorage.getItem("Token")

    async function loadAlerts() {
        setLoading(true)
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } }
            const response = await axios.get("http://localhost:4000/api/products", config)
            
            // Filter products that are low stock or out of stock
            const alertProducts = response.data.data.filter(
                p => p.quantity <= p.minStockLevel
            )
            setProducts(alertProducts)
        } catch (err) {
            console.error("Alerts error:", err)
            setError("Could not load low stock alerts.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadAlerts()
    }, [])

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div className="page-header">
                <div className="page-title-wrap">
                    <h2 style={{ fontSize: "1.5rem" }}>Stock Alerts Panel</h2>
                    <span className="page-subtitle">Critical stock-outs and low threshold products that require ordering</span>
                </div>
            </div>

            {loading ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "30vh" }}>
                    <div style={{ width: "30px", height: "30px", border: "3px solid var(--border)", borderTopColor: "var(--primary)", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
                </div>
            ) : error ? (
                <div style={{ textAlign: "center", color: "var(--danger)", padding: "20px" }}>{error}</div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {products.length > 0 ? (
                        <div className="table-container">
                            <table className="custom-table">
                                <thead>
                                    <tr>
                                        <th>Product Name</th>
                                        <th>SKU</th>
                                        <th>Current Stock</th>
                                        <th>Min Threshold</th>
                                        <th>Status Warning</th>
                                        <th>Vendor Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map(prod => {
                                        const isOutOfStock = prod.quantity === 0
                                        return (
                                            <tr key={prod._id}>
                                                <td style={{ fontWeight: 600 }}>{prod.name}</td>
                                                <td style={{ fontFamily: "monospace" }}>{prod.sku}</td>
                                                <td style={{ fontWeight: "bold", color: isOutOfStock ? "var(--danger)" : "var(--warning)" }}>
                                                    {prod.quantity} Units
                                                </td>
                                                <td>{prod.minStockLevel} Units</td>
                                                <td>
                                                    {isOutOfStock ? (
                                                        <span className="badge badge-danger" style={{ animation: "pulseRed 2s infinite" }}>
                                                            CRITICAL: Out of Stock
                                                        </span>
                                                    ) : (
                                                        <span className="badge badge-warning">
                                                            WARNING: Low Stock
                                                        </span>
                                                    )}
                                                </td>
                                                <td>
                                                    <div style={{ fontWeight: 500 }}>{prod.supplier?.name || "No Supplier Assigned"}</div>
                                                    <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{prod.supplier?.email || "N/A"}</div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="glass-panel" style={{ padding: "48px", textAlign: "center", borderLeft: "4px solid var(--success)" }}>
                            <ShieldCheck size={48} style={{ color: "var(--success)", marginBottom: "16px" }} />
                            <h3 style={{ fontSize: "1.2rem", fontWeight: "700", marginBottom: "8px" }}>Inventory Levels Perfect</h3>
                            <p style={{ color: "var(--text-muted)" }}>
                                All products are well supplied. There are no low stock warnings at this time.
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default Alerts
