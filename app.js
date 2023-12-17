const express = require('express');

const app = express()

//slash API
app.get('/',async(request,response)=>{
    response.send("It's working priya")
})

app.listen(3000,()=>{
    console.log('ok')
})