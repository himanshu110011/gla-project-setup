const User = require("../../../Models/UserSchema/user")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const ActivityLog = require("../../../Models/ActivityLogSchema/activityLog")

const loginController = async (req, res) => {
    try {
        const { email, password } = req.body

        const existingUser = await User.findOne({ email })
        if (!existingUser) {
            return res.status(400).json({ message: "Invalid email or password" })
        }

        if (existingUser.status === "inactive") {
            return res.status(403).json({ message: "Your account has been deactivated" })
        }

        const matchedPassword = await bcrypt.compare(password, existingUser.password)
        if (!matchedPassword) {
            return res.status(400).json({ message: "Invalid email or password" })
        }

        const secretKey = process.env.JWT_SECRET || "Dikshant16121999Chakrayat@123"
        const token = jwt.sign(
            { 
                id: existingUser._id, 
                email: existingUser.email, 
                role: existingUser.role,
                name: existingUser.name 
            }, 
            secretKey,
            { expiresIn: "7d" }
        )

        // Log login activity
        await ActivityLog.create({
            user: existingUser._id,
            action: "USER_LOGIN",
            details: `User ${existingUser.name} logged in`
        })

        res.status(200).json({
            message: "Logged in successfully",
            token,
            user: {
                id: existingUser._id,
                name: existingUser.name,
                email: existingUser.email,
                role: existingUser.role
            }
        })
    } catch (error) {
        console.error("Login controller error:", error)
        res.status(500).json({ message: "Internal server error" })
    }
}

module.exports = loginController