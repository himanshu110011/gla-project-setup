import React, { useState, useEffect } from "react"
import axios from "axios"
import { Users as UsersIcon, ShieldAlert, UserPlus, Trash2, Shield, ShieldCheck } from "lucide-react"

function Users() {
    const [usersList, setUsersList] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const token = localStorage.getItem("Token")

    async function loadUsers() {
        setLoading(true)
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } }
            const response = await axios.get("http://localhost:4000/api/getData", config)
            setUsersList(response.data.data)
        } catch (err) {
            console.error("Users load error:", err)
            setError("Could not load users database.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadUsers()
    }, [])

    async function handleRoleChange(userObj, newRole) {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } }
            await axios.put(`http://localhost:4000/api/user/update/${userObj._id}`, {
                ...userObj,
                role: newRole
            }, config)
            alert(`Updated ${userObj.name}'s role to ${newRole}`)
            loadUsers()
        } catch (err) {
            console.error("Role change error:", err)
            alert("Error updating role.")
        }
    }

    async function handleStatusChange(userObj, newStatus) {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } }
            await axios.put(`http://localhost:4000/api/user/update/${userObj._id}`, {
                ...userObj,
                status: newStatus
            }, config)
            alert(`Updated ${userObj.name}'s account status to ${newStatus}`)
            loadUsers()
        } catch (err) {
            console.error("Status change error:", err)
            alert("Error updating account status.")
        }
    }

    async function handleDeleteUser(id, name) {
        if (!window.confirm(`Are you sure you want to permanently delete user "${name}"?`)) {
            return
        }

        try {
            const config = { headers: { Authorization: `Bearer ${token}` } }
            await axios.delete(`http://localhost:4000/api/user/delete/${id}`, config)
            alert("User deleted.")
            loadUsers()
        } catch (err) {
            console.error("User deletion error:", err)
            alert("Error deleting user.")
        }
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div className="page-header">
                <div className="page-title-wrap">
                    <h2 style={{ fontSize: "1.5rem" }}>System Access Control</h2>
                    <span className="page-subtitle">Manage user roles, credentials status and access levels</span>
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
                                <th>Name</th>
                                <th>Email</th>
                                <th>Current Role</th>
                                <th>Status</th>
                                <th>Actions Control</th>
                                <th style={{ textAlign: "right" }}>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usersList.length > 0 ? (
                                usersList.map(item => (
                                    <tr key={item._id}>
                                        <td style={{ fontWeight: 600 }}>{item.name}</td>
                                        <td>{item.email}</td>
                                        <td>
                                            <span className={`badge ${item.role === "admin" ? "badge-info" : "badge-success"}`}>
                                                {item.role}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`badge ${item.status === "active" ? "badge-success" : "badge-danger"}`}>
                                                {item.status || "active"}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ display: "flex", gap: "10px" }}>
                                                {/* Role Switcher */}
                                                <select 
                                                    className="form-select" 
                                                    value={item.role} 
                                                    onChange={(e) => handleRoleChange(item, e.target.value)}
                                                    style={{ padding: "4px 8px", width: "100px", fontSize: "12px", height: "30px" }}
                                                >
                                                    <option value="staff">Staff</option>
                                                    <option value="admin">Admin</option>
                                                </select>

                                                {/* Status Switcher */}
                                                <select 
                                                    className="form-select" 
                                                    value={item.status || "active"} 
                                                    onChange={(e) => handleStatusChange(item, e.target.value)}
                                                    style={{ padding: "4px 8px", width: "110px", fontSize: "12px", height: "30px" }}
                                                >
                                                    <option value="active">Active</option>
                                                    <option value="inactive">Suspended</option>
                                                </select>
                                            </div>
                                        </td>
                                        <td style={{ textAlign: "right" }}>
                                            <button 
                                                className="btn btn-danger" 
                                                onClick={() => handleDeleteUser(item._id, item.name)}
                                                style={{ padding: "6px 10px" }}
                                                title="Delete User"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: "center", color: "var(--text-muted)", padding: "30px" }}>
                                        No registered users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default Users
