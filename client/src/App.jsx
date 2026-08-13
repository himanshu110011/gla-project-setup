import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import LoginPage from './Pages/Login Page/loginPage'
import RegistrationPage from './Pages/Registration Page/registrationPage'
import Dashboard from './Pages/Dashboard/Dashboard'
import Products from './Pages/Products/Products'
import Categories from './Pages/Categories/Categories'
import Suppliers from './Pages/Suppliers/Suppliers'
import Transactions from './Pages/Transactions/Transactions'
import Alerts from './Pages/Alerts/Alerts'
import Reports from './Pages/Reports/Reports'
import Users from './Pages/Users/Users'
import Settings from './Pages/Settings/Settings'

// Layout & Protected Route
import Layout from './Components/Layout/Layout'
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute'

function App() {
  return (
    <Router>
      <Routes>
        {/* Public auth screens */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />

        {/* Private layout routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute allowedRoles={["admin", "staff"]}>
              <Layout><Dashboard /></Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/products" 
          element={
            <ProtectedRoute allowedRoles={["admin", "staff"]}>
              <Layout><Products /></Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/categories" 
          element={
            <ProtectedRoute allowedRoles={["admin", "staff"]}>
              <Layout><Categories /></Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/suppliers" 
          element={
            <ProtectedRoute allowedRoles={["admin", "staff"]}>
              <Layout><Suppliers /></Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/transactions" 
          element={
            <ProtectedRoute allowedRoles={["admin", "staff"]}>
              <Layout><Transactions /></Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/alerts" 
          element={
            <ProtectedRoute allowedRoles={["admin", "staff"]}>
              <Layout><Alerts /></Layout>
            </ProtectedRoute>
          } 
        />

        {/* Admin only views */}
        <Route 
          path="/reports" 
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Layout><Reports /></Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/users" 
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Layout><Users /></Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Layout><Settings /></Layout>
            </ProtectedRoute>
          } 
        />

        {/* Fallback navigation */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  )
}

export default App
