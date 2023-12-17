const express = require('express');

const app = express()

//slash API
app.get('/',async(request,response)=>{
    response.send("It's working bott")
})

app.listen(3000,()=>{
    console.log('ok')
})

module.exports= app