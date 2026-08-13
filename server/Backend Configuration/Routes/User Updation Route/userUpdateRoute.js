const express= require("express")
const router= express.Router()
const updateUser= require("../../Controllers/User Updation Controller/userController") 
const verifyToken=require("../../Configuration Folders/Middleware Configuration/authMiddleware")
const authorize=require("../../Configuration Folders/Middleware Configuration/roleSpecificMiddleware")

router.put("/user/update/:id", verifyToken, authorize("admin"), updateUser)

module.exports= router;