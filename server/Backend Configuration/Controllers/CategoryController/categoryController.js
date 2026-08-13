const Category = require("../../Models/CategorySchema/category")
const Product = require("../../Models/ProductSchema/product")

// Get all categories
const getCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ name: 1 })
        res.status(200).json({ data: categories })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Create a category
const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body
        if (!name) {
            return res.status(400).json({ message: "Category name is required" })
        }

        const existing = await Category.findOne({ name })
        if (existing) {
            return res.status(400).json({ message: "Category already exists" })
        }

        const category = new Category({ name, description })
        await category.save()
        res.status(201).json({ message: "Category created successfully", data: category })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Update category
const updateCategory = async (req, res) => {
    try {
        const { name, description } = req.body
        const { id } = req.params

        const category = await Category.findById(id)
        if (!category) {
            return res.status(404).json({ message: "Category not found" })
        }

        if (name && name !== category.name) {
            const existing = await Category.findOne({ name })
            if (existing) {
                return res.status(400).json({ message: "Category name already in use" })
            }
            category.name = name
        }

        if (description !== undefined) {
            category.description = description
        }

        await category.save()
        res.status(200).json({ message: "Category updated successfully", data: category })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Delete category
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params
        
        // Check if any products are using this category
        const productsCount = await Product.countDocuments({ category: id })
        if (productsCount > 0) {
            return res.status(400).json({ 
                message: `Cannot delete category. It is linked to ${productsCount} product(s).` 
            })
        }

        const deleted = await Category.findByIdAndDelete(id)
        if (!deleted) {
            return res.status(404).json({ message: "Category not found" })
        }

        res.status(200).json({ message: "Category deleted successfully" })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
}
