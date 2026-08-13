const User = require("../../../Models/UserSchema/user")
const bcrypt = require("bcrypt");

const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Please fill in all required fields"
            });
        }

        // Validate role if provided
        let userRole = "staff";
        if (role && ["admin", "staff"].includes(role.toLowerCase())) {
            userRole = role.toLowerCase();
        }

        // checking the User 
        const checkExistingUser = await User.findOne({ email });
 
        if (checkExistingUser) {
            return res.status(400).json({
                message: "User Already Exists"
            });
        }

        //  Password Hashing
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            role: userRole,
            status: "active"
        });

        const data = await user.save();

        res.status(201).json({
            message: "Registration Successful",
            registeredData: {
                id: data._id,
                name: data.name,
                email: data.email,
                role: data.role
            }
        });

    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = { register };