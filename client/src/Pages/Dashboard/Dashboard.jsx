import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { 
    TrendingUp, 
    Layers, 
    AlertCircle, 
    TrendingDown, 
    DollarSign, 
    Package, 
    Users, 
    PlusCircle,
    ArrowUpRight,
    ArrowDownRight,
    ArrowLeftRight,
    RefreshCw
} from "lucide-react"
import { 
    ResponsiveContainer, 
    PieChart, 
    Pie, 
    Cell, 
    Tooltip, 
    Legend, 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid 
} from "recharts"

const COLORS = ["#6366f1", "#d946ef", "#10b981", "#f59e0b", "#ef4444", "#3b82f6", "#8b5cf6"]

function Dashboard() {
    const navigate = useNavigate()
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const token = localStorage.getItem("Token")

    async function fetchStats() {
        setLoading(true)
        try {
            const response = await axios.get("http://localhost:4000/api/reports/dashboard", {
                headers: { Authorization: `Bearer ${token}` }
            })
            setStats(response.data.data)
        } catch (error) {
            console.error("Dashboard error:", error)
            setError("Could not load dashboard statistics. Make sure the server is running.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchStats()
    }, [])

    if (loading) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "50vh", flexDirection: "column", gap: "16px" }}>
                <div style={{
                    width: "40px",
                    height: "40px",
                    border: "3px solid var(--border)",
                    borderTopColor: "var(--primary)",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite"
                }}></div>
                <p style={{ color: "var(--text-muted)", fontWeight: "600" }}>Fetching real-time inventory stats...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="glass-panel" style={{ padding: "40px", textAlign: "center", maxWidth: "600px", margin: "40px auto" }}>
                <AlertCircle size={48} style={{ color: "var(--danger)", marginBottom: "16px" }} />
                <h3 style={{ marginBottom: "12px", fontSize: "1.25rem" }}>Failed to Connect</h3>
                <p style={{ color: "var(--text-muted)", marginBottom: "24px" }}>{error}</p>
                <button className="btn btn-primary" onClick={fetchStats}>
                    <RefreshCw size={16} />
                    Retry Connection
                </button>
            </div>
        )
    }

    // Process data for charts
    const chartData = stats?.categoryDistribution || []

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            {/* Stat Cards Grid */}
            <div className="stat-card-grid">
                <div className="glass-panel stat-card">
                    <div className="stat-card-details">
                        <span className="stat-card-label">Inventory Value</span>
                        <span className="stat-card-value">${stats?.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="stat-card-icon-wrap" style={{ backgroundColor: "var(--success-glow)", color: "var(--success)" }}>
                        <DollarSign size={24} />
                    </div>
                </div>

                <div className="glass-panel stat-card">
                    <div className="stat-card-details">
                        <span className="stat-card-label">Stock Items</span>
                        <span className="stat-card-value">{stats?.totalStock.toLocaleString()}</span>
                    </div>
                    <div className="stat-card-icon-wrap" style={{ backgroundColor: "var(--primary-glow)", color: "var(--primary)" }}>
                        <Package size={24} />
                    </div>
                </div>

                <div className="glass-panel stat-card" onClick={() => navigate("/alerts")} style={{ cursor: "pointer" }}>
                    <div className="stat-card-details">
                        <span className="stat-card-label">Low Stock items</span>
                        <span className="stat-card-value" style={{ color: stats?.lowStockCount > 0 ? "var(--warning)" : "inherit" }}>
                            {stats?.lowStockCount}
                        </span>
                    </div>
                    <div className="stat-card-icon-wrap" style={{ 
                        backgroundColor: stats?.lowStockCount > 0 ? "var(--warning-glow)" : "var(--bg-surface-hover)", 
                        color: stats?.lowStockCount > 0 ? "var(--warning)" : "var(--text-muted)" 
                    }}>
                        <AlertCircle size={24} />
                    </div>
                </div>

                <div className="glass-panel stat-card" onClick={() => navigate("/alerts")} style={{ cursor: "pointer" }}>
                    <div className="stat-card-details">
                        <span className="stat-card-label">Out of Stock</span>
                        <span className="stat-card-value" style={{ color: stats?.outOfStockCount > 0 ? "var(--danger)" : "inherit" }}>
                            {stats?.outOfStockCount}
                        </span>
                    </div>
                    <div className="stat-card-icon-wrap" style={{ 
                        backgroundColor: stats?.outOfStockCount > 0 ? "var(--danger-glow)" : "var(--bg-surface-hover)", 
                        color: stats?.outOfStockCount > 0 ? "var(--danger)" : "var(--text-muted)" 
                    }}>
                        <AlertCircle size={24} />
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "24px" }}>
                <div className="glass-panel" style={{ padding: "24px" }}>
                    <h3 style={{ marginBottom: "20px", fontSize: "1rem", fontWeight: "600", color: "var(--text-muted)", textTransform: "uppercase" }}>
                        Stock Levels by Category
                    </h3>
                    <div style={{ width: "100%", height: 300 }}>
                        {chartData.length === 0 ? (
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--text-muted)" }}>
                                No products found. Add products to generate chart.
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                    <XAxis dataKey="name" stroke="var(--text-muted)" style={{ fontSize: "11px" }} />
                                    <YAxis stroke="var(--text-muted)" style={{ fontSize: "11px" }} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: "var(--bg-sidebar)", borderColor: "var(--border)", color: "var(--text-main)" }}
                                        cursor={{ fill: "var(--bg-surface-hover)" }}
                                    />
                                    <Bar dataKey="stockCount" fill="var(--primary)" radius={[4, 4, 0, 0]} name="Stock Units" />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: "24px" }}>
                    <h3 style={{ marginBottom: "20px", fontSize: "1rem", fontWeight: "600", color: "var(--text-muted)", textTransform: "uppercase" }}>
                        Products Split by Category
                    </h3>
                    <div style={{ width: "100%", height: 300 }}>
                        {chartData.length === 0 ? (
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--text-muted)" }}>
                                No products found. Add products to generate chart.
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={5}
                                        dataKey="productCount"
                                        nameKey="name"
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: "var(--bg-sidebar)", borderColor: "var(--border)", color: "var(--text-main)" }} />
                                    <Legend formatter={(value) => <span style={{ color: "var(--text-main)", fontSize: "12px" }}>{value}</span>} />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Actions & Recent Transactions */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 2fr))", gap: "24px" }}>
                {/* Recent Transactions */}
                <div className="glass-panel" style={{ padding: "24px", gridColumn: "span 2" }}>
                    <h3 style={{ marginBottom: "20px", fontSize: "1.1rem", fontWeight: "600" }}>Recent Transactions</h3>
                    <div className="table-container" style={{ margin: "0", border: "none" }}>
                        <table className="custom-table">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Action</th>
                                    <th>Quantity</th>
                                    <th>Performed By</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats?.recentTransactions && stats.recentTransactions.length > 0 ? (
                                    stats.recentTransactions.map((tx) => (
                                        <tr key={tx._id}>
                                            <td style={{ fontWeight: 600 }}>
                                                {tx.product?.name || "Deleted Product"}
                                                <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                                                    SKU: {tx.product?.sku || "N/A"}
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`badge ${tx.type === "stock-in" ? "badge-success" : "badge-danger"}`}>
                                                    {tx.type === "stock-in" ? (
                                                        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                                            <ArrowUpRight size={12} /> Stock In
                                                        </span>
                                                    ) : (
                                                        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                                            <ArrowDownRight size={12} /> Stock Out
                                                        </span>
                                                    )}
                                                </span>
                                            </td>
                                            <td>{tx.quantity}</td>
                                            <td>{tx.performedBy?.name || "System"}</td>
                                            <td>{new Date(tx.createdAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: "center", color: "var(--text-muted)", padding: "30px" }}>
                                            No transaction records logged. Perform stock transactions to see history.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Actions Panel */}
                <div className="glass-panel" style={{ padding: "24px" }}>
                    <h3 style={{ marginBottom: "20px", fontSize: "1.1rem", fontWeight: "600" }}>Quick Actions</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        <button 
                            className="btn btn-primary" 
                            onClick={() => navigate("/products")}
                            style={{ width: "100%", justifyContent: "flex-start", padding: "14px 16px" }}
                        >
                            <PlusCircle size={18} />
                            Add New Product
                        </button>
                        <button 
                            className="btn btn-secondary" 
                            onClick={() => navigate("/transactions")}
                            style={{ width: "100%", justifyContent: "flex-start", padding: "14px 16px" }}
                        >
                            <ArrowLeftRight size={18} />
                            Record Stock Actions
                        </button>
                        <button 
                            className="btn btn-secondary" 
                            onClick={() => navigate("/alerts")}
                            style={{ width: "100%", justifyContent: "flex-start", padding: "14px 16px" }}
                        >
                            <AlertCircle size={18} />
                            View Low Stock Alerts
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
export { COLORS }
