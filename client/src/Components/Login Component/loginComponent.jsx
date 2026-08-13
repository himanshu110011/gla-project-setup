import React, { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Mail, Lock, Eye, EyeOff, ShieldAlert, Loader2 } from "lucide-react"
import axios from "axios"

function LoginComponent() {
    const navigate = useNavigate()
    const [user, setUser] = useState({
        email: "",
        password: ""
    })
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    function handleChange(e) {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        })
        if (error) setError("")
    }

    async function handleSubmit(e) {
        e.preventDefault()
        if (!user.email || !user.password) {
            setError("Please fill in all fields.")
            return
        }

        setIsLoading(true)
        try {
            const response = await axios.post("http://localhost:4000/api/loginRoute/api", user)
            
            const token = response.data.token
            localStorage.setItem("Token", token)
            
            navigate("/dashboard")
        } catch (error) {
            console.error("Login component error:", error)
            const msg = error.response?.data?.message || "Invalid credentials. Please try again."
            setError(msg)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            background: "radial-gradient(circle at top right, var(--primary-glow), transparent), radial-gradient(circle at bottom left, var(--accent-glow), transparent), #09090b",
            padding: "20px"
        }}>
            <div className="glass-panel animate-fade" style={{
                width: "100%",
                maxWidth: "420px",
                padding: "40px 32px",
                border: "1px solid var(--border)"
            }}>
                <div style={{ textAlign: "center", marginBottom: "32px" }}>
                    <div style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "50px",
                        height: "50px",
                        background: "linear-gradient(135deg, var(--primary), var(--accent))",
                        borderRadius: "var(--radius-lg)",
                        color: "white",
                        fontWeight: "800",
                        fontSize: "1.5rem",
                        marginBottom: "16px",
                        boxShadow: "var(--shadow-glow)"
                    }}>IP</div>
                    <h2 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "8px" }}>Welcome Back</h2>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
                        Sign in to access your inventory dashboard
                    </p>
                </div>

                {error && (
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        backgroundColor: "var(--danger-glow)",
                        color: "var(--danger)",
                        padding: "12px 16px",
                        borderRadius: "var(--radius-md)",
                        fontSize: "0.875rem",
                        marginBottom: "24px",
                        border: "1px solid rgba(239, 68, 68, 0.15)"
                    }}>
                        <ShieldAlert size={18} style={{ flexShrink: 0 }} />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group" style={{ position: "relative" }}>
                        <label className="form-label" htmlFor="email">Email Address</label>
                        <div style={{ position: "relative" }}>
                            <Mail size={18} style={{
                                position: "absolute",
                                left: "14px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                color: "var(--text-muted)"
                            }} />
                            <input 
                                id="email"
                                className="form-input" 
                                placeholder="name@company.com" 
                                type="email" 
                                name="email" 
                                value={user.email} 
                                onChange={handleChange}
                                style={{ paddingLeft: "42px" }}
                            />
                        </div>
                    </div>

                    <div className="form-group" style={{ position: "relative", marginBottom: "28px" }}>
                        <label className="form-label" htmlFor="password">Password</label>
                        <div style={{ position: "relative" }}>
                            <Lock size={18} style={{
                                position: "absolute",
                                left: "14px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                color: "var(--text-muted)"
                            }} />
                            <input 
                                id="password"
                                className="form-input" 
                                placeholder="Enter password" 
                                type={showPassword ? "text" : "password"} 
                                name="password" 
                                value={user.password} 
                                onChange={handleChange}
                                style={{ paddingLeft: "42px", paddingRight: "42px" }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: "absolute",
                                    right: "14px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    background: "none",
                                    border: "none",
                                    color: "var(--text-muted)",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center"
                                }}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={isLoading}
                        style={{ width: "100%", padding: "12px", fontSize: "0.95rem" }}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="animate-spin" size={18} style={{ animation: "spin 1s linear infinite" }} />
                                <span>Signing in...</span>
                            </>
                        ) : "Sign In"}
                    </button>
                </form>

                <div style={{ textAlign: "center", marginTop: "24px", fontSize: "0.875rem", color: "var(--text-muted)" }}>
                    Don't have an account?{" "}
                    <Link to="/register" style={{ color: "var(--primary)", fontWeight: "600", textDecoration: "underline" }}>
                        Register Staff/Admin
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default LoginComponent