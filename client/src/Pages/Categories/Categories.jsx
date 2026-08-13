import React, { useState, useEffect } from "react"
import axios from "axios"
import { Plus, Edit, Trash2, X } from "lucide-react"
import { parseJwt } from "../../Components/ProtectedRoute/ProtectedRoute"

function Categories() {
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    
    // Modal State
    const [showModal, setShowModal] = useState(false)
    const [isEditMode, setIsEditMode] = useState(false)
    const [currentCategoryId, setCurrentCategoryId] = useState(null)
    const [formData, setFormData] = useState({
        name: "",
        description: ""
    })

    const token = localStorage.getItem("Token")
    const user = token ? parseJwt(token) : null
    const isAdmin = user?.role === "admin"

    async function loadCategories() {
        setLoading(true)
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } }
            const response = await axios.get("http://localhost:4000/api/categories", config)
            setCategories(response.data.data)
        } catch (err) {
            console.error("Categories loading error:", err)
            setError("Could not load categories list.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadCategories()
    }, [])

    function handleInputChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    function openCreateModal() {
        setIsEditMode(false)
        setFormData({ name: "", description: "" })
        setShowModal(true)
    }

    function openEditModal(category) {
        setIsEditMode(true)
        setCurrentCategoryId(category._id)
        setFormData({
            name: category.name,
            description: category.description || ""
        })
        setShowModal(true)
    }

    async function handleFormSubmit(e) {
        e.preventDefault()
        const config = { headers: { Authorization: `Bearer ${token}` } }
        
        try {
            if (isEditMode) {
                await axios.put(`http://localhost:4000/api/categories/${currentCategoryId}`, formData, config)
                alert("Category updated successfully!")
            } else {
                await axios.post("http://localhost:4000/api/categories", formData, config)
                alert("Category created successfully!")
            }
            setShowModal(false)
            loadCategories()
        } catch (err) {
            console.error("Category save error:", err)
            alert(err.response?.data?.message || "Error saving category")
        }
    }

    async function handleDeleteCategory(id, name) {
        if (!window.confirm(`Are you sure you want to delete category "${name}"?`)) {
            return
        }

        try {
            const config = { headers: { Authorization: `Bearer ${token}` } }
            await axios.delete(`http://localhost:4000/api/categories/${id}`, config)
            alert("Category deleted successfully.")
            loadCategories()
        } catch (err) {
            console.error("Category deletion error:", err)
            alert(err.response?.data?.message || "Error deleting category")
        }
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div className="page-header">
                <div className="page-title-wrap">
                    <h2 style={{ fontSize: "1.5rem" }}>Product Categories</h2>
                    <span className="page-subtitle">Organize and group items in the catalog</span>
                </div>
                <button className="btn btn-primary" onClick={openCreateModal}>
                    <Plus size={18} /> Add Category
                </button>
            </div>

            {loading ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "30vh" }}>
                    <div style={{ width: "30px", height: "30px", border: "3px solid var(--border)", borderTopColor: "var(--primary)", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
                </div>
            ) : error ? (
                <div style={{ textAlign: "center", color: "var(--danger)", padding: "20px" }}>{error}</div>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
                    {categories.length > 0 ? (
                        categories.map(cat => (
                            <div key={cat._id} className="glass-panel" style={{ padding: "24px", display: "flex", flexDirection: "column", justifyContent: "between", minHeight: "160px" }}>
                                <div style={{ flexGrow: 1 }}>
                                    <h3 style={{ fontSize: "1.1rem", marginBottom: "8px", fontWeight: "700" }}>{cat.name}</h3>
                                    <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
                                        {cat.description || "No description provided."}
                                    </p>
                                </div>
                                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "16px", borderTop: "1px solid var(--border)", paddingTop: "12px" }}>
                                    <button className="btn btn-secondary" onClick={() => openEditModal(cat)} style={{ padding: "6px 12px", fontSize: "0.8rem" }}>
                                        <Edit size={14} /> Edit
                                    </button>
                                    {isAdmin && (
                                        <button className="btn btn-danger" onClick={() => handleDeleteCategory(cat._id, cat.name)} style={{ padding: "6px 12px", fontSize: "0.8rem" }}>
                                            <Trash2 size={14} /> Delete
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="glass-panel" style={{ padding: "40px", gridColumn: "1/-1", textAlign: "center", color: "var(--text-muted)" }}>
                            No categories registered. Click "Add Category" to get started.
                        </div>
                    )}
                </div>
            )}

            {/* Modal Dialog */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content animate-slide-up" style={{ maxWidth: "450px" }}>
                        <div className="modal-header">
                            <h3 style={{ fontSize: "1.2rem", fontWeight: "700" }}>{isEditMode ? "Edit Category" : "Add New Category"}</h3>
                            <button className="modal-close-btn" onClick={() => setShowModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleFormSubmit}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label className="form-label">Category Name *</label>
                                    <input 
                                        type="text" 
                                        name="name" 
                                        className="form-input" 
                                        placeholder="e.g. Electronics, Stationary" 
                                        value={formData.name} 
                                        onChange={handleInputChange} 
                                        required
                                    />
                                </div>
                                <div className="form-group" style={{ marginBottom: "0" }}>
                                    <label className="form-label">Description</label>
                                    <textarea 
                                        name="description" 
                                        className="form-textarea" 
                                        placeholder="Briefly describe what items fall under this category" 
                                        value={formData.description} 
                                        onChange={handleInputChange} 
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">{isEditMode ? "Save Changes" : "Create Category"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Categories
