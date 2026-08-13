import React, { useState, useEffect } from "react"
import axios from "axios"
import { 
    Plus, 
    Search, 
    Edit, 
    Trash2, 
    AlertTriangle,
    CheckCircle,
    X,
    Filter,
    PackageCheck
} from "lucide-react"
import { parseJwt } from "../../Components/ProtectedRoute/ProtectedRoute"

function Products() {
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [suppliers, setSuppliers] = useState([])
    
    // Filters State
    const [search, setSearch] = useState("")
    const [categoryFilter, setCategoryFilter] = useState("")
    const [stockFilter, setStockFilter] = useState("")
    
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    
    // Modal State
    const [showModal, setShowModal] = useState(false)
    const [isEditMode, setIsEditMode] = useState(false)
    const [currentProductId, setCurrentProductId] = useState(null)
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        sku: "",
        price: "",
        quantity: "",
        minStockLevel: "10",
        category: "",
        supplier: ""
    })

    const token = localStorage.getItem("Token")
    const user = token ? parseJwt(token) : null
    const isAdmin = user?.role === "admin"

    async function loadData() {
        setLoading(true)
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } }
            
            // Build query params
            const params = {}
            if (search) params.search = search
            if (categoryFilter) params.category = categoryFilter
            if (stockFilter) params.stockStatus = stockFilter

            const [productsRes, categoriesRes, suppliersRes] = await Promise.all([
                axios.get("http://localhost:4000/api/products", { ...config, params }),
                axios.get("http://localhost:4000/api/categories", config),
                axios.get("http://localhost:4000/api/suppliers", config)
            ])

            setProducts(productsRes.data.data)
            setCategories(categoriesRes.data.data)
            setSuppliers(suppliersRes.data.data)

            // Setup default select values for form if not set
            if (categoriesRes.data.data.length > 0 && !formData.category) {
                setFormData(prev => ({
                    ...prev,
                    category: categoriesRes.data.data[0]._id
                }))
            }
            if (suppliersRes.data.data.length > 0 && !formData.supplier) {
                setFormData(prev => ({
                    ...prev,
                    supplier: suppliersRes.data.data[0]._id
                }))
            }
        } catch (error) {
            console.error("Products loading error:", error)
            setError("Could not load inventory catalog.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadData()
    }, [search, categoryFilter, stockFilter])

    function handleInputChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    function generateSKU() {
        const prefix = "PROD"
        const rand = Math.floor(1000 + Math.random() * 9000)
        setFormData(prev => ({ ...prev, sku: `${prefix}-${rand}` }))
    }

    function openCreateModal() {
        setIsEditMode(false)
        setFormData({
            name: "",
            description: "",
            sku: "",
            price: "",
            quantity: "0",
            minStockLevel: "10",
            category: categories[0]?._id || "",
            supplier: suppliers[0]?._id || ""
        })
        setShowModal(true)
    }

    function openEditModal(product) {
        setIsEditMode(true)
        setCurrentProductId(product._id)
        setFormData({
            name: product.name,
            description: product.description || "",
            sku: product.sku,
            price: product.price,
            quantity: product.quantity,
            minStockLevel: product.minStockLevel,
            category: product.category?._id || "",
            supplier: product.supplier?._id || ""
        })
        setShowModal(true)
    }

    async function handleFormSubmit(e) {
        e.preventDefault()
        const config = { headers: { Authorization: `Bearer ${token}` } }

        try {
            if (isEditMode) {
                await axios.put(`http://localhost:4000/api/products/${currentProductId}`, formData, config)
                alert("Product updated successfully!")
            } else {
                await axios.post("http://localhost:4000/api/products", formData, config)
                alert("Product created successfully!")
            }
            setShowModal(false)
            loadData()
        } catch (error) {
            console.error("Product submit error:", error)
            alert(error.response?.data?.message || "Error submitting product form")
        }
    }

    async function handleDeleteProduct(id, name) {
        if (!window.confirm(`Are you sure you want to delete product "${name}"? This deletes its history.`)) {
            return
        }

        try {
            const config = { headers: { Authorization: `Bearer ${token}` } }
            await axios.delete(`http://localhost:4000/api/products/${id}`, config)
            alert("Product deleted.")
            loadData()
        } catch (error) {
            console.error("Product deletion error:", error)
            alert(error.response?.data?.message || "Error deleting product")
        }
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div className="page-header">
                <div className="page-title-wrap">
                    <h2 style={{ fontSize: "1.5rem" }}>Inventory Catalog</h2>
                    <span className="page-subtitle">Track, filter, and organize stock assets</span>
                </div>
                <button className="btn btn-primary" onClick={openCreateModal}>
                    <Plus size={18} /> Add Product
                </button>
            </div>

            {/* Filter and Search Bar */}
            <div className="glass-panel" style={{ padding: "20px", display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "center" }}>
                <div style={{ position: "relative", flexGrow: 1, minWidth: "200px" }}>
                    <Search size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                    <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Search product by name or SKU..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ paddingLeft: "40px" }}
                    />
                </div>

                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", width: "100%", maxWidth: "500px" }}>
                    <select 
                        className="form-select" 
                        value={categoryFilter} 
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        style={{ flexGrow: 1 }}
                    >
                        <option value="">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                    </select>

                    <select 
                        className="form-select" 
                        value={stockFilter} 
                        onChange={(e) => setStockFilter(e.target.value)}
                        style={{ flexGrow: 1 }}
                    >
                        <option value="">All Stock Levels</option>
                        <option value="normal">Normal Stock</option>
                        <option value="low">Low Stock Alerts</option>
                        <option value="out">Out of Stock</option>
                    </select>
                </div>
            </div>

            {/* Products Table */}
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
                                <th>Product Details</th>
                                <th>SKU</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Stock Status</th>
                                <th>Supplier</th>
                                <th style={{ textAlign: "right" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length > 0 ? (
                                products.map(prod => {
                                    const isOutOfStock = prod.quantity === 0
                                    const isLowStock = prod.quantity <= prod.minStockLevel && prod.quantity > 0
                                    
                                    return (
                                        <tr key={prod._id}>
                                            <td>
                                                <div style={{ fontWeight: 600 }}>{prod.name}</div>
                                                <div style={{ fontSize: "12px", color: "var(--text-muted)", maxWidth: "250px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                    {prod.description || "No description provided."}
                                                </div>
                                            </td>
                                            <td style={{ fontFamily: "monospace", fontSize: "0.85rem", fontWeight: "bold" }}>{prod.sku}</td>
                                            <td>{prod.category?.name || "Uncategorized"}</td>
                                            <td style={{ fontWeight: 600 }}>${prod.price.toFixed(2)}</td>
                                            <td>
                                                {isOutOfStock ? (
                                                    <span className="badge badge-danger" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                                        <AlertTriangle size={12} /> Out of Stock (0)
                                                    </span>
                                                ) : isLowStock ? (
                                                    <span className="badge badge-warning" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                                        <AlertTriangle size={12} /> Low Stock ({prod.quantity})
                                                    </span>
                                                ) : (
                                                    <span className="badge badge-success" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                                        <CheckCircle size={12} /> OK ({prod.quantity})
                                                    </span>
                                                )}
                                            </td>
                                            <td>{prod.supplier?.name || "None"}</td>
                                            <td style={{ textAlign: "right" }}>
                                                <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                                                    <button className="btn btn-secondary" onClick={() => openEditModal(prod)} style={{ padding: "6px 10px" }} title="Edit Product">
                                                        <Edit size={14} />
                                                    </button>
                                                    {isAdmin && (
                                                        <button className="btn btn-danger" onClick={() => handleDeleteProduct(prod._id, prod.name)} style={{ padding: "6px 10px" }} title="Delete Product">
                                                            <Trash2 size={14} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            ) : (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: "center", color: "var(--text-muted)", padding: "40px" }}>
                                        No products match your filters. Click "Add Product" to populate stock.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Add / Edit Product Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content animate-slide-up" style={{ maxWidth: "600px" }}>
                        <div className="modal-header">
                            <h3 style={{ fontSize: "1.2rem", fontWeight: "700" }}>{isEditMode ? "Edit Product Details" : "Add New Product"}</h3>
                            <button className="modal-close-btn" onClick={() => setShowModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleFormSubmit}>
                            <div className="modal-body">
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                                    <div className="form-group" style={{ gridColumn: "span 2" }}>
                                        <label className="form-label">Product Name *</label>
                                        <input 
                                            type="text" 
                                            name="name" 
                                            className="form-input" 
                                            placeholder="Enter product title" 
                                            value={formData.name} 
                                            onChange={handleInputChange} 
                                            required
                                        />
                                    </div>

                                    <div className="form-group" style={{ gridColumn: "span 2" }}>
                                        <label className="form-label">Product Description</label>
                                        <textarea 
                                            name="description" 
                                            className="form-textarea" 
                                            placeholder="Specify dimensions, size, colors or usage details" 
                                            value={formData.description} 
                                            onChange={handleInputChange} 
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">SKU (Stock Keeping Unit) *</label>
                                        <div style={{ display: "flex", gap: "8px" }}>
                                            <input 
                                                type="text" 
                                                name="sku" 
                                                className="form-input" 
                                                placeholder="PROD-1001" 
                                                value={formData.sku} 
                                                onChange={handleInputChange} 
                                                required
                                            />
                                            <button type="button" className="btn btn-secondary" onClick={generateSKU} style={{ padding: "8px 12px" }}>Auto</button>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Unit Price ($) *</label>
                                        <input 
                                            type="number" 
                                            name="price" 
                                            step="0.01" 
                                            min="0" 
                                            className="form-input" 
                                            placeholder="19.99" 
                                            value={formData.price} 
                                            onChange={handleInputChange} 
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Initial Quantity *</label>
                                        <input 
                                            type="number" 
                                            name="quantity" 
                                            min="0" 
                                            className="form-input" 
                                            value={formData.quantity} 
                                            onChange={handleInputChange}
                                            disabled={isEditMode} /* Quantity in edit mode is updated via adjustments/actions */
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Min Stock Threshold *</label>
                                        <input 
                                            type="number" 
                                            name="minStockLevel" 
                                            min="0" 
                                            className="form-input" 
                                            value={formData.minStockLevel} 
                                            onChange={handleInputChange} 
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Category *</label>
                                        <select 
                                            className="form-select" 
                                            name="category" 
                                            value={formData.category} 
                                            onChange={handleInputChange}
                                            required
                                        >
                                            {categories.map(cat => (
                                                <option key={cat._id} value={cat._id}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Supplier *</label>
                                        <select 
                                            className="form-select" 
                                            name="supplier" 
                                            value={formData.supplier} 
                                            onChange={handleInputChange}
                                            required
                                        >
                                            {suppliers.map(sup => (
                                                <option key={sup._id} value={sup._id}>{sup.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">{isEditMode ? "Save Changes" : "Create Product"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Products
