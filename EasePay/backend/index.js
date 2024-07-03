const express = require("express");
const app=express()
const PORT =3000
const mainRouter = require("../backend/routes/index")
const cors = require("cors")
const jwt=require("jsonwebtoken")

app.use(cors())
app.use(express.json())
app.use("/api/v1",mainRouter)



app.listen(PORT,()=>{
    console.log(`server is running on PORT ${PORT}`);
})



