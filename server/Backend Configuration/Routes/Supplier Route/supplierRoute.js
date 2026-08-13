const express = require("express")
const router = express.Router()
const {
    getSuppliers,
    createSupplier,
    updateSupplier,
    deleteSupplier
} = require("../../Controllers/SupplierController/supplierController")

const verifyToken = require("../../Configuration Folders/Middleware Configuration/authMiddleware")
const authorize = require("../../Configuration Folders/Middleware Configuration/roleSpecificMiddleware")

router.get("/suppliers", verifyToken, getSuppliers)
router.post("/suppliers", verifyToken, createSupplier)
router.put("/suppliers/:id", verifyToken, updateSupplier)
router.delete("/suppliers/:id", verifyToken, authorize("admin"), deleteSupplier)

module.exports = router
