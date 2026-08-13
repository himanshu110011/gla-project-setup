const express = require("express")
const router = express.Router()
const {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
} = require("../../Controllers/CategoryController/categoryController")

const verifyToken = require("../../Configuration Folders/Middleware Configuration/authMiddleware")
const authorize = require("../../Configuration Folders/Middleware Configuration/roleSpecificMiddleware")

router.get("/categories", verifyToken, getCategories)
router.post("/categories", verifyToken, createCategory)
router.put("/categories/:id", verifyToken, updateCategory)
router.delete("/categories/:id", verifyToken, authorize("admin"), deleteCategory)

module.exports = router
