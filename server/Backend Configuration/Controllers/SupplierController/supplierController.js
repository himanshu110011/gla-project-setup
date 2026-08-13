const Supplier = require("../../Models/SupplierSchema/supplier")
const Product = require("../../Models/ProductSchema/product")

// Get all suppliers
const getSuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.find().sort({ name: 1 })
        res.status(200).json({ data: suppliers })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Create a supplier
const createSupplier = async (req, res) => {
    try {
        const { name, contactPerson, email, phone, address, status } = req.body
        if (!name || !email) {
            return res.status(400).json({ message: "Supplier name and email are required" })
        }

        const supplier = new Supplier({
            name,
            contactPerson,
            email,
            phone,
            address,
            status: status || "active"
        })

        await supplier.save()
        res.status(201).json({ message: "Supplier created successfully", data: supplier })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Update supplier
const updateSupplier = async (req, res) => {
    try {
        const { name, contactPerson, email, phone, address, status } = req.body
        const { id } = req.params

        const supplier = await Supplier.findById(id)
        if (!supplier) {
            return res.status(404).json({ message: "Supplier not found" })
        }

        if (name) supplier.name = name
        if (contactPerson !== undefined) supplier.contactPerson = contactPerson
        if (email) supplier.email = email
        if (phone !== undefined) supplier.phone = phone
        if (address !== undefined) supplier.address = address
        if (status) supplier.status = status

        await supplier.save()
        res.status(200).json({ message: "Supplier updated successfully", data: supplier })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Delete supplier
const deleteSupplier = async (req, res) => {
    try {
        const { id } = req.params

        // Check if any products are using this supplier
        const productsCount = await Product.countDocuments({ supplier: id })
        if (productsCount > 0) {
            return res.status(400).json({
                message: `Cannot delete supplier. It is linked to ${productsCount} product(s).`
            })
        }

        const deleted = await Supplier.findByIdAndDelete(id)
        if (!deleted) {
            return res.status(404).json({ message: "Supplier not found" })
        }

        res.status(200).json({ message: "Supplier deleted successfully" })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = {
    getSuppliers,
    createSupplier,
    updateSupplier,
    deleteSupplier
}
