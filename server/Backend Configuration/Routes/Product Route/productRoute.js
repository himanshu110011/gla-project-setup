const express = require("express")
const router = express.Router()
const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = require("../../Controllers/ProductController/productController")

const verifyToken = require("../../Configuration Folders/Middleware Configuration/authMiddleware")
const authorize = require("../../Configuration Folders/Middleware Configuration/roleSpecificMiddleware")

router.get("/products", verifyToken, getProducts)
router.get("/products/:id", verifyToken, getProductById)
router.post("/products", verifyToken, createProduct)
router.put("/products/:id", verifyToken, updateProduct)
router.delete("/products/:id", verifyToken, authorize("admin"), deleteProduct)

module.exports = router
