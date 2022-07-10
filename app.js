const express = require("express")
const app = express();

const api = require("./routes/pcdiga")

app.get("/",(req,res)=>{
    res.send("Pc diga api")
   
})

app.use("/pcdiga",api)


app.listen(3000,()=>{
    console.log("http://localhost:3000")
})