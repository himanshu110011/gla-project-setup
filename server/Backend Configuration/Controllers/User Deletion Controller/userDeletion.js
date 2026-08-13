const User = require("../../Models/UserSchema/user")
const ActivityLog = require("../../Models/ActivityLogSchema/activityLog")

const deletedUser= async(req,res)=>{ 
    try {
        const {id}=req.params;
        const userToDelete = await User.findById(id)
        if (!userToDelete) {
            return res.status(404).json({ success: false, message: "User not found" })
        }

        await User.findByIdAndDelete(id)

        // Log deletion activity
        await ActivityLog.create({
            user: req.user.id,
            action: "USER_DELETE",
            details: `Deleted user ${userToDelete.name} (${userToDelete.email})`
        })

        res.json({
            success:true,
            message:"User Has been Deleted"
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            success:false,
            message:"Server Error"
        })
    }
}

module.exports = { deletedUser };