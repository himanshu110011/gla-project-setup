const jwt= require("jsonwebtoken")
const User= require("../../Models/UserSchema/user")

const verifyToken= async (req,res,next)=>{
 const authHeader=req.headers.authorization;
 console.log("Auth Header:", authHeader)
 if(!authHeader){
    return res.status(401).json({
        message:"Token is Missing/Token is invalid"
    })
 }
 

//  Bearer token
const token= authHeader.split(" ")[1];

try {
    const secretKey= process.env.JWT_SECRET || "Dikshant16121999Chakrayat@123"
    const decode= jwt.verify(token,secretKey)
    console.log("Decoded Token:", decode)

    // Check if user is suspended/inactive
    const user = await User.findById(decode.id);
    if (!user || user.status === "inactive") {
        return res.status(403).json({
            message: "User account is suspended or deleted"
        });
    }

    req.user= decode
    next()
    
} catch (error) {
    console.log(error.message)
    res.status(401).json({ message: "Invalid or expired token" })
}


}
module.exports=verifyToken