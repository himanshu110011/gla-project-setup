import React, { useState, useEffect } from "react"
import axios from "axios"
import { Plus, Edit, Trash2, X, Phone, Mail, MapPin, User } from "lucide-react"
import { parseJwt } from "../../Components/ProtectedRoute/ProtectedRoute"

function Suppliers() {
    const [suppliers, setSuppliers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    // Modal State
    const [showModal, setShowModal] = useState(false)
    const [isEditMode, setIsEditMode] = useState(false)
    const [currentSupplierId, setCurrentSupplierId] = useState(null)
    const [formData, setFormData] = useState({
        name: "",
        contactPerson: "",
        email: "",
        phone: "",
        address: "",
        status: "active"
    })

    const token = localStorage.getItem("Token")
    const user = token ? parseJwt(token) : null
    const isAdmin = user?.role === "admin"

    async function loadSuppliers() {
        setLoading(true)
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } }
            const response = await axios.get("http://localhost:4000/api/suppliers", config)
            setSuppliers(response.data.data)
        } catch (err) {
            console.error("Suppliers loading error:", err)
            setError("Could not load suppliers profiles.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadSuppliers()
    }, [])

    function handleInputChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    function openCreateModal() {
        setIsEditMode(false)
        setFormData({
            name: "",
            contactPerson: "",
            email: "",
            phone: "",
            address: "",
            status: "active"
        })
        setShowModal(true)
    }

    function openEditModal(supplier) {
        setIsEditMode(true)
        setCurrentSupplierId(supplier._id)
        setFormData({
            name: supplier.name,
            contactPerson: supplier.contactPerson || "",
            email: supplier.email,
            phone: supplier.phone || "",
            address: supplier.address || "",
            status: supplier.status || "active"
        })
        setShowModal(true)
    }

    async function handleFormSubmit(e) {
        e.preventDefault()
        const config = { headers: { Authorization: `Bearer ${token}` } }
        
        try {
            if (isEditMode) {
                await axios.put(`http://localhost:4000/api/suppliers/${currentSupplierId}`, formData, config)
                alert("Supplier profile updated!")
            } else {
                await axios.post("http://localhost:4000/api/suppliers", formData, config)
                alert("Supplier profile created!")
            }
            setShowModal(false)
            loadSuppliers()
        } catch (err) {
            console.error("Supplier save error:", err)
            alert(err.response?.data?.message || "Error saving supplier details")
        }
    }

    async function handleDeleteSupplier(id, name) {
        if (!window.confirm(`Are you sure you want to delete supplier "${name}"?`)) {
            return
        }

        try {
            const config = { headers: { Authorization: `Bearer ${token}` } }
            await axios.delete(`http://localhost:4000/api/suppliers/${id}`, config)
            alert("Supplier profile deleted.")
            loadSuppliers()
        } catch (err) {
            console.error("Supplier deletion error:", err)
            alert(err.response?.data?.message || "Error deleting supplier")
        }
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div className="page-header">
                <div className="page-title-wrap">
                    <h2 style={{ fontSize: "1.5rem" }}>Supplier Profiles</h2>
                    <span className="page-subtitle">Manage partner vendors, contact information and status</span>
                </div>
                <button className="btn btn-primary" onClick={openCreateModal}>
                    <Plus size={18} /> Add Supplier
                </button>
            </div>

            {loading ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "30vh" }}>
                    <div style={{ width: "30px", height: "30px", border: "3px solid var(--border)", borderTopColor: "var(--primary)", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
                </div>
            ) : error ? (
                <div style={{ textAlign: "center", color: "var(--danger)", padding: "20px" }}>{error}</div>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
                    {suppliers.length > 0 ? (
                        suppliers.map(sup => (
                            <div key={sup._id} className="glass-panel" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px", borderLeft: sup.status === "active" ? "4px solid var(--success)" : "4px solid var(--border)" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                                    <div>
                                        <h3 style={{ fontSize: "1.15rem", fontWeight: "700", marginBottom: "4px" }}>{sup.name}</h3>
                                        <span className={`badge ${sup.status === "active" ? "badge-success" : "badge-danger"}`}>
                                            {sup.status}
                                        </span>
                                    </div>
                                </div>

                                <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.875rem", color: "var(--text-muted)", flexGrow: 1 }}>
                                    {sup.contactPerson && (
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                            <User size={16} />
                                            <span>{sup.contactPerson} (Contact)</span>
                                        </div>
                                    )}
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <Mail size={16} />
                                        <span>{sup.email}</span>
                                    </div>
                                    {sup.phone && (
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                            <Phone size={16} />
                                            <span>{sup.phone}</span>
                                        </div>
                                    )}
                                    {sup.address && (
                                        <div style={{ display: "flex", alignItems: "start", gap: "8px" }}>
                                            <MapPin size={16} style={{ marginTop: "3px", flexShrink: 0 }} />
                                            <span>{sup.address}</span>
                                        </div>
                                    )}
                                </div>

                                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", borderTop: "1px solid var(--border)", paddingTop: "14px" }}>
                                    <button className="btn btn-secondary" onClick={() => openEditModal(sup)} style={{ padding: "6px 12px", fontSize: "0.8rem" }}>
                                        <Edit size={14} /> Edit
                                    </button>
                                    {isAdmin && (
                                        <button className="btn btn-danger" onClick={() => handleDeleteSupplier(sup._id, sup.name)} style={{ padding: "6px 12px", fontSize: "0.8rem" }}>
                                            <Trash2 size={14} /> Delete
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="glass-panel" style={{ padding: "40px", gridColumn: "1/-1", textAlign: "center", color: "var(--text-muted)" }}>
                            No suppliers registered. Click "Add Supplier" to register profiles.
                        </div>
                    )}
                </div>
            )}

            {/* Modal Dialog */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content animate-slide-up" style={{ maxWidth: "500px" }}>
                        <div className="modal-header">
                            <h3 style={{ fontSize: "1.2rem", fontWeight: "700" }}>{isEditMode ? "Edit Supplier Info" : "Add New Supplier"}</h3>
                            <button className="modal-close-btn" onClick={() => setShowModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleFormSubmit}>
                            <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label className="form-label">Vendor Name *</label>
                                    <input 
                                        type="text" 
                                        name="name" 
                                        className="form-input" 
                                        placeholder="e.g. Logitech Global, Staples Inc" 
                                        value={formData.name} 
                                        onChange={handleInputChange} 
                                        required
                                    />
                                </div>

                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label className="form-label">Contact Person</label>
                                    <input 
                                        type="text" 
                                        name="contactPerson" 
                                        className="form-input" 
                                        placeholder="John Miller" 
                                        value={formData.contactPerson} 
                                        onChange={handleInputChange} 
                                    />
                                </div>

                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label className="form-label">Email Address *</label>
                                    <input 
                                        type="email" 
                                        name="email" 
                                        className="form-input" 
                                        placeholder="vendor@company.com" 
                                        value={formData.email} 
                                        onChange={handleInputChange} 
                                        required
                                    />
                                </div>

                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label className="form-label">Phone Number</label>
                                    <input 
                                        type="text" 
                                        name="phone" 
                                        className="form-input" 
                                        placeholder="+1 (555) 019-2834" 
                                        value={formData.phone} 
                                        onChange={handleInputChange} 
                                    />
                                </div>

                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label className="form-label">Business Address</label>
                                    <input 
                                        type="text" 
                                        name="address" 
                                        className="form-input" 
                                        placeholder="120 Industrial Pkwy, Sector 4" 
                                        value={formData.address} 
                                        onChange={handleInputChange} 
                                    />
                                </div>

                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label className="form-label">Supplier Status</label>
                                    <select 
                                        className="form-select" 
                                        name="status" 
                                        value={formData.status} 
                                        onChange={handleInputChange}
                                    >
                                        <option value="active">Active Business Partner</option>
                                        <option value="inactive">Inactive / Blacklisted</option>
                                    </select>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">{isEditMode ? "Save Changes" : "Create Supplier"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Suppliers
