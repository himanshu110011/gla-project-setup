import React, { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import axios from "axios"
import { 
    LayoutDashboard, 
    Package, 
    Tags, 
    Truck, 
    ArrowLeftRight, 
    AlertTriangle, 
    BarChart3, 
    Users, 
    Settings, 
    LogOut, 
    Sun, 
    Moon, 
    Bell, 
    Menu, 
    X,
    UserCheck
} from "lucide-react"
import { parseJwt } from "../ProtectedRoute/ProtectedRoute"
import "./layout.css"

const Layout = ({ children }) => {
    const location = useLocation()
    const navigate = useNavigate()
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [isMobileOpen, setIsMobileOpen] = useState(false)
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark")
    const [lowStockCount, setLowStockCount] = useState(0)

    const token = localStorage.getItem("Token")
    const user = token ? parseJwt(token) : null

    // Apply theme
    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme)
        localStorage.setItem("theme", theme)
    }, [theme])

    // Toggle theme
    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark")
    }

    // Fetch alerts count
    const fetchAlerts = async () => {
        try {
            if (!token) return
            const response = await axios.get("http://localhost:4000/api/products", {
                headers: { Authorization: `Bearer ${token}` }
            })
            // Filter products with low stock levels
            const lowStockProducts = response.data.data.filter(
                p => p.quantity <= p.minStockLevel
            )
            setLowStockCount(lowStockProducts.length)
        } catch (error) {
            console.error("Error fetching alerts in Layout:", error)
        }
    }

    useEffect(() => {
        fetchAlerts()
        // Poll alerts every 30 seconds
        const interval = setInterval(fetchAlerts, 30000)
        return () => clearInterval(interval)
    }, [])

    const handleLogout = () => {
        localStorage.removeItem("Token")
        navigate("/login")
    }

    // Navigation items configuration
    const navItems = [
        { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["admin", "staff"] },
        { path: "/products", label: "Products", icon: Package, roles: ["admin", "staff"] },
        { path: "/categories", label: "Categories", icon: Tags, roles: ["admin", "staff"] },
        { path: "/suppliers", label: "Suppliers", icon: Truck, roles: ["admin", "staff"] },
        { path: "/transactions", label: "Stock Actions", icon: ArrowLeftRight, roles: ["admin", "staff"] },
        { path: "/alerts", label: "Stock Alerts", icon: AlertTriangle, roles: ["admin", "staff"], badge: lowStockCount },
        { path: "/reports", label: "Analytics Reports", icon: BarChart3, roles: ["admin"] },
        { path: "/users", label: "User Control", icon: Users, roles: ["admin"] },
        { path: "/settings", label: "Settings", icon: Settings, roles: ["admin"] }
    ]

    // Filtered by user role
    const filteredNavItems = navItems.filter(item => user && item.roles.includes(user.role))

    const activeItem = navItems.find(item => location.pathname === item.path)
    const pageTitle = activeItem ? activeItem.label : "Inventory Management"

    return (
        <div className="layout-container">
            {/* Sidebar Navigation */}
            <aside className={`sidebar ${isCollapsed ? "collapsed" : ""} ${isMobileOpen ? "mobile-open" : ""}`}>
                <div className="sidebar-header">
                    <div className="logo-container">
                        <div className="logo-icon">IP</div>
                        {!isCollapsed && <span style={{ fontWeight: 800 }}>InventoryPro</span>}
                    </div>
                    <button 
                        className="sidebar-toggle-btn"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                    >
                        {isCollapsed ? <Menu size={20} /> : <X size={20} />}
                    </button>
                </div>

                <nav className="sidebar-nav">
                    {filteredNavItems.map((item) => {
                        const Icon = item.icon
                        const isActive = location.pathname === item.path
                        return (
                            <Link 
                                key={item.path} 
                                to={item.path}
                                className={`nav-item ${isActive ? "active" : ""}`}
                                onClick={() => setIsMobileOpen(false)}
                            >
                                <Icon className="nav-item-icon" />
                                {!isCollapsed && <span className="nav-item-label">{item.label}</span>}
                                {!isCollapsed && item.badge > 0 && (
                                    <span 
                                        className="badge-count" 
                                        style={{ position: "relative", top: "0", right: "0", marginLeft: "auto" }}
                                    >
                                        {item.badge}
                                    </span>
                                )}
                            </Link>
                        )
                    })}
                </nav>

                <div className="sidebar-footer">
                    {user && (
                        <div className="user-profile-section">
                            <div className="user-avatar">
                                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                            </div>
                            {!isCollapsed && (
                                <div className="user-info">
                                    <span className="user-name">{user.name}</span>
                                    <span className="user-role-badge">{user.role}</span>
                                </div>
                            )}
                        </div>
                    )}
                    <button className="nav-item" onClick={handleLogout} style={{ border: "none", background: "none", width: "100%", textAlign: "left" }}>
                        <LogOut className="nav-item-icon" style={{ color: "var(--danger)" }} />
                        {!isCollapsed && <span className="nav-item-label" style={{ color: "var(--danger)" }}>Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div 
                    style={{
                        position: "fixed",
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        backgroundColor: "rgba(0,0,0,0.5)",
                        zIndex: 99,
                        backdropFilter: "blur(4px)"
                    }}
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Main Area */}
            <main className="main-area">
                <header className="header">
                    <div className="header-left">
                        <button 
                            className="mobile-menu-btn"
                            onClick={() => setIsMobileOpen(!isMobileOpen)}
                        >
                            <Menu size={24} />
                        </button>
                        <h2 className="breadcrumb-title">{pageTitle}</h2>
                    </div>

                    <div className="header-right">
                        {/* Theme Toggle */}
                        <button className="icon-action-btn" onClick={toggleTheme} title="Toggle Theme">
                            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        {/* Alerts Notification Bell */}
                        <button 
                            className="icon-action-btn" 
                            onClick={() => navigate("/alerts")}
                            title="Low Stock Alerts"
                        >
                            <Bell size={20} />
                            {lowStockCount > 0 && <span className="badge-count">{lowStockCount}</span>}
                        </button>
                    </div>
                </header>

                <div className="page-content animate-slide-up">
                    {children}
                </div>
            </main>
        </div>
    )
}

export default Layout
