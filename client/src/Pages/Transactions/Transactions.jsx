import React, { useState, useEffect } from "react"
import axios from "axios"
import { ArrowLeftRight, Plus, ArrowUpRight, ArrowDownRight, Search, X } from "lucide-react"

function Transactions() {
    const [transactions, setTransactions] = useState([])
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    // Form State
    const [showModal, setShowModal] = useState(false)
    const [search, setSearch] = useState("")
    const [formData, setFormData] = useState({
        product: "",
        type: "stock-in",
        quantity: "1",
        reason: ""
    })

    const token = localStorage.getItem("Token")

    async function loadData() {
        setLoading(true)
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } }
            const [txRes, prodRes] = await Promise.all([
                axios.get("http://localhost:4000/api/transactions", config),
                axios.get("http://localhost:4000/api/products", config)
            ])

            setTransactions(txRes.data.data)
            setProducts(prodRes.data.data)

            if (prodRes.data.data.length > 0 && !formData.product) {
                setFormData(prev => ({
                    ...prev,
                    product: prodRes.data.data[0]._id
                }))
            }
        } catch (err) {
            console.error("Transactions loading error:", err)
            setError("Could not load transaction data.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadData()
    }, [])

    function handleInputChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    function openModal() {
        setFormData({
            product: products[0]?._id || "",
            type: "stock-in",
            quantity: "1",
            reason: ""
        })
        setShowModal(true)
    }

    async function handleFormSubmit(e) {
        e.preventDefault()
        const config = { headers: { Authorization: `Bearer ${token}` } }
        
        try {
            await axios.post("http://localhost:4000/api/transactions", formData, config)
            alert("Stock transaction recorded successfully!")
            setShowModal(false)
            loadData()
        } catch (err) {
            console.error("Stock action save error:", err)
            alert(err.response?.data?.message || "Error saving stock transaction")
        }
    }

    // Filter transaction table by search
    const filteredTx = transactions.filter(tx => {
        const prodName = tx.product?.name?.toLowerCase() || ""
        const prodSku = tx.product?.sku?.toLowerCase() || ""
        const searchLower = search.toLowerCase()
        return prodName.includes(searchLower) || prodSku.includes(searchLower)
    })

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div className="page-header">
                <div className="page-title-wrap">
                    <h2 style={{ fontSize: "1.5rem" }}>Stock Action Ledger</h2>
                    <span className="page-subtitle">Track, audit, and log stock-in / stock-out transactions</span>
                </div>
                <button className="btn btn-primary" onClick={openModal}>
                    <Plus size={18} /> Record Stock Action
                </button>
            </div>

            {/* Search Bar */}
            <div className="glass-panel" style={{ padding: "20px", display: "flex", alignItems: "center" }}>
                <div style={{ position: "relative", width: "100%", maxWidth: "400px" }}>
                    <Search size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                    <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Search ledger by product name or SKU..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ paddingLeft: "40px" }}
                    />
                </div>
            </div>

            {loading ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "30vh" }}>
                    <div style={{ width: "30px", height: "30px", border: "3px solid var(--border)", borderTopColor: "var(--primary)", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
                </div>
            ) : error ? (
                <div style={{ textAlign: "center", color: "var(--danger)", padding: "20px" }}>{error}</div>
            ) : (
                <div className="table-container">
                    <table className="custom-table">
                        <thead>
                            <tr>
                                <th>Timestamp</th>
                                <th>Product Details</th>
                                <th>Action Type</th>
                                <th>Quantity Change</th>
                                <th>Reason / Notes</th>
                                <th>Performed By</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTx.length > 0 ? (
                                filteredTx.map(tx => (
                                    <tr key={tx._id}>
                                        <td>{new Date(tx.createdAt).toLocaleString()}</td>
                                        <td>
                                            <div style={{ fontWeight: 600 }}>{tx.product?.name || "Deleted Product"}</div>
                                            <div style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "monospace" }}>
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
                                        <td style={{ fontWeight: "bold" }}>
                                            {tx.type === "stock-in" ? "+" : "-"}{tx.quantity}
                                        </td>
                                        <td>{tx.reason || "Inventory count update"}</td>
                                        <td>
                                            <div style={{ fontWeight: 500 }}>{tx.performedBy?.name || "System"}</div>
                                            <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{tx.performedBy?.email}</div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: "center", color: "var(--text-muted)", padding: "40px" }}>
                                        No transaction logs found matching search query.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Record Transaction Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content animate-slide-up" style={{ maxWidth: "450px" }}>
                        <div className="modal-header">
                            <h3 style={{ fontSize: "1.2rem", fontWeight: "700" }}>Record Stock Movement</h3>
                            <button className="modal-close-btn" onClick={() => setShowModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleFormSubmit}>
                            <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label className="form-label">Select Product *</label>
                                    <select 
                                        className="form-select" 
                                        name="product" 
                                        value={formData.product} 
                                        onChange={handleInputChange}
                                        required
                                    >
                                        {products.length > 0 ? (
                                            products.map(p => (
                                                <option key={p._id} value={p._id}>
                                                    {p.name} (SKU: {p.sku}) - Qty: {p.quantity}
                                                </option>
                                            ))
                                        ) : (
                                            <option value="">No products available</option>
                                        )}
                                    </select>
                                </div>

                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label className="form-label">Transaction Type *</label>
                                    <select 
                                        className="form-select" 
                                        name="type" 
                                        value={formData.type} 
                                        onChange={handleInputChange}
                                    >
                                        <option value="stock-in">Stock-In (Incoming inventory / Reorder)</option>
                                        <option value="stock-out">Stock-Out (Outgoing inventory / Sale / Loss)</option>
                                    </select>
                                </div>

                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label className="form-label">Quantity *</label>
                                    <input 
                                        type="number" 
                                        name="quantity" 
                                        min="1" 
                                        className="form-input" 
                                        value={formData.quantity} 
                                        onChange={handleInputChange} 
                                        required
                                    />
                                </div>

                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label className="form-label">Reason / Reference Notes</label>
                                    <input 
                                        type="text" 
                                        name="reason" 
                                        className="form-input" 
                                        placeholder="e.g. Sales Invoice #2801, Damaged return" 
                                        value={formData.reason} 
                                        onChange={handleInputChange} 
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Log Action</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Transactions
