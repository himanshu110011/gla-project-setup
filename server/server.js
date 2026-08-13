require("dotenv").config()
const express= require("express")
const app= express()
const connectDB= require("./Backend Configuration/Configuration Folders/DB Configuration/dbCofig")
const cors=require("cors")

const RegistrationApi= require("./Backend Configuration/Routes/Registration & Login Route/Register/register")
const getUsers= require("./Backend Configuration/Routes/Get All User Route/getUser")
const deleteUsers= require("./Backend Configuration/Routes/User Data Deleted/userDataDelete")
const updatedUser= require("./Backend Configuration/Routes/User Updation Route/userUpdateRoute")
const LoginRoute= require("./Backend Configuration/Routes/Registration & Login Route/Login/loginRoute")

// New Routes
const categoryRoute = require("./Backend Configuration/Routes/Category Route/categoryRoute")
const supplierRoute = require("./Backend Configuration/Routes/Supplier Route/supplierRoute")
const productRoute = require("./Backend Configuration/Routes/Product Route/productRoute")
const stockTransactionRoute = require("./Backend Configuration/Routes/StockTransaction Route/stockTransactionRoute")
const reportsRoute = require("./Backend Configuration/Routes/Reports Route/reportsRoute")
const settingsRoute = require("./Backend Configuration/Routes/Settings Route/settingsRoute")

app.use(express.json())
app.use(cors())

// Connect DB
connectDB()

// Register routes
app.use("/api", RegistrationApi)
app.use("/api", getUsers)
app.use("/api", deleteUsers)
app.use("/api", updatedUser)
app.use("/api", LoginRoute)
app.use("/api", categoryRoute)
app.use("/api", supplierRoute)
app.use("/api", productRoute)
app.use("/api", stockTransactionRoute)
app.use("/api", reportsRoute)
app.use("/api", settingsRoute)

const PORT = process.env.PORT || 4000
app.listen(PORT,()=>{
    console.log(`Your Server is running at port ${PORT}`)
})