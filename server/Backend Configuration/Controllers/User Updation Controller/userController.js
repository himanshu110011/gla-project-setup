const User = require("../../Models/UserSchema/user")
const ActivityLog = require("../../Models/ActivityLogSchema/activityLog")

    const updateUser=async (req,res)=>{
        try {
            const{name, email, role, status}=req.body

            const userToUpdate = await User.findById(req.params.id)
            if (!userToUpdate) {
                return res.status(404).json({ message: "User not found" })
            }

            const updatedUser= await User.findByIdAndUpdate(req.params.id,
                {name, email, role, status},
                {new: true}
            )

            // Log update activity
            await ActivityLog.create({
                user: req.user.id,
                action: "USER_UPDATE",
                details: `Updated details for user ${updatedUser.name} (${updatedUser.email})`
            })

            res.json({
                message:"successfully updated",
                data:updatedUser
            })

            console.log("data has been updated :" ,updatedUser)
            
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "Server error updating user" })
        }
    }

    module.exports= updateUser