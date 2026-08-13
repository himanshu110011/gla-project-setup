const Product = require("../../Models/ProductSchema/product")
const StockTransaction = require("../../Models/StockTransactionSchema/stockTransaction")
const ActivityLog = require("../../Models/ActivityLogSchema/activityLog")

// Get all products with filters
const getProducts = async (req, res) => {
    try {
        const { search, category, supplier, stockStatus } = req.query
        
        let filter = {}

        // Search by name or SKU
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { sku: { $regex: search, $options: "i" } }
            ]
        }

        // Filter by Category
        if (category) {
            filter.category = category
        }

        // Filter by Supplier
        if (supplier) {
            filter.supplier = supplier
        }

        // Fetch products
        let products = await Product.find(filter)
            .populate("category", "name")
            .populate("supplier", "name")
            .sort({ createdAt: -1 })

        // Filter by Stock Status (Low stock: quantity <= minStockLevel)
        if (stockStatus) {
            if (stockStatus === "low") {
                products = products.filter(p => p.quantity <= p.minStockLevel && p.quantity > 0)
            } else if (stockStatus === "out") {
                products = products.filter(p => p.quantity === 0)
            } else if (stockStatus === "normal") {
                products = products.filter(p => p.quantity > p.minStockLevel)
            }
        }

        res.status(200).json({ data: products })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Get single product
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate("category", "name")
            .populate("supplier", "name")

        if (!product) {
            return res.status(404).json({ message: "Product not found" })
        }

        res.status(200).json({ data: product })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Create Product
const createProduct = async (req, res) => {
    try {
        const { name, description, sku, price, quantity, minStockLevel, category, supplier } = req.body
        const userId = req.user.id

        if (!name || !sku || price === undefined || !category || !supplier) {
            return res.status(400).json({ message: "Please provide all required fields" })
        }

        // Check if SKU is unique
        const existing = await Product.findOne({ sku })
        if (existing) {
            return res.status(400).json({ message: "SKU already exists. Choose a unique SKU." })
        }

        const product = new Product({
            name,
            description,
            sku,
            price,
            quantity: quantity || 0,
            minStockLevel: minStockLevel || 10,
            category,
            supplier
        })

        const savedProduct = await product.save()

        // Create transaction log if quantity > 0
        if (quantity && quantity > 0) {
            const transaction = new StockTransaction({
                product: savedProduct._id,
                type: "stock-in",
                quantity: quantity,
                reason: "Initial Stocking",
                performedBy: userId
            })
            await transaction.save()
        }

        // Log system activity
        await ActivityLog.create({
            user: userId,
            action: "PRODUCT_CREATE",
            details: `Created product ${name} (SKU: ${sku}) with quantity ${quantity || 0}`
        })

        res.status(201).json({ message: "Product created successfully", data: savedProduct })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Update Product
const updateProduct = async (req, res) => {
    try {
        const { name, description, sku, price, quantity, minStockLevel, category, supplier } = req.body
        const { id } = req.params
        const userId = req.user.id

        const product = await Product.findById(id)
        if (!product) {
            return res.status(404).json({ message: "Product not found" })
        }

        // Check SKU uniqueness if changed
        if (sku && sku !== product.sku) {
            const existing = await Product.findOne({ sku })
            if (existing) {
                return res.status(400).json({ message: "SKU already in use" })
            }
            product.sku = sku
        }

        if (name) product.name = name
        if (description !== undefined) product.description = description
        if (price !== undefined) product.price = price
        if (minStockLevel !== undefined) product.minStockLevel = minStockLevel
        if (category) product.category = category
        if (supplier) product.supplier = supplier

        // Handle quantity update (Inventory adjustment)
        if (quantity !== undefined && quantity !== product.quantity) {
            const difference = quantity - product.quantity
            const transactionType = difference > 0 ? "stock-in" : "stock-out"
            
            const transaction = new StockTransaction({
                product: product._id,
                type: transactionType,
                quantity: Math.abs(difference),
                reason: "Inventory Adjustment (Edit)",
                performedBy: userId
            })
            await transaction.save()

            product.quantity = quantity
        }

        const updatedProduct = await product.save()

        // Log system activity
        await ActivityLog.create({
            user: userId,
            action: "PRODUCT_UPDATE",
            details: `Updated product ${product.name} (SKU: ${product.sku})`
        })

        res.status(200).json({ message: "Product updated successfully", data: updatedProduct })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Delete Product
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params
        const userId = req.user.id

        const product = await Product.findById(id)
        if (!product) {
            return res.status(404).json({ message: "Product not found" })
        }

        // Delete stock transactions for this product
        await StockTransaction.deleteMany({ product: id })

        await Product.findByIdAndDelete(id)

        // Log system activity
        await ActivityLog.create({
            user: userId,
            action: "PRODUCT_DELETE",
            details: `Deleted product ${product.name} (SKU: ${product.sku})`
        })

        res.status(200).json({ message: "Product and associated transaction history deleted" })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
}
