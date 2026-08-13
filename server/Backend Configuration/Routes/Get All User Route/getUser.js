const express= require("express")
const router= express.Router()
const getUser= require("../../Controllers/Get All User Controller/getUser") 
const verifyToken=require("../../Configuration Folders/Middleware Configuration/authMiddleware")
const authorize=require("../../Configuration Folders/Middleware Configuration/roleSpecificMiddleware")

// Get all users (Admin only)
router.get("/getData", verifyToken, authorize("admin"), getUser)

// Verify admin token check
router.get("/getData/admin/api", verifyToken, authorize("admin"), (req,res)=>{
    res.json({
        message:"welcome Admin"
    })
})

module.exports= router;