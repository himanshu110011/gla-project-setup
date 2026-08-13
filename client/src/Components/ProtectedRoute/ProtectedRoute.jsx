import React from "react"
import { Navigate } from "react-router-dom"

const parseJwt = (token) => {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
};

const ProtectedRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem("Token")

    if (!token) {
        return <Navigate to="/login" replace />
    }

    const userData = parseJwt(token)
    if (!userData) {
        localStorage.removeItem("Token")
        return <Navigate to="/login" replace />
    }

    // Check expiration (exp is in seconds)
    const currentTimestamp = Math.floor(Date.now() / 1000)
    if (userData.exp && userData.exp < currentTimestamp) {
        localStorage.removeItem("Token")
        alert("Your session has expired. Please log in again.")
        return <Navigate to="/login" replace />
    }

    // Check RBAC permissions
    if (allowedRoles && !allowedRoles.includes(userData.role)) {
        return (
            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                padding: "20px",
                textAlign: "center",
                backgroundColor: "var(--bg-app)",
                color: "var(--text-main)"
            }}>
                <h1 style={{ color: "var(--danger)", marginBottom: "10px", fontSize: "2rem" }}>Access Denied</h1>
                <p style={{ color: "var(--text-muted)", marginBottom: "20px" }}>
                    You do not have the required permissions to view this page.
                </p>
                <button 
                    onClick={() => window.location.href = "/"}
                    style={{
                        padding: "10px 20px",
                        backgroundColor: "var(--primary)",
                        color: "var(--text-inverse)",
                        border: "none",
                        borderRadius: "var(--radius-md)",
                        cursor: "pointer",
                        fontWeight: "600"
                    }}
                >
                    Back to Dashboard
                </button>
            </div>
        )
    }

    return children
}

export default ProtectedRoute
export { parseJwt }
