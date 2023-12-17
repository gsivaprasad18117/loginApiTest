const express = require('express');
const path = require('path');
const cors = require('cors');

const {open} = require('sqlite');
const sqlite3 = require('sqlite3');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = express()

app.use(cors())
app.use(express.json());

const dbPath = path.join(__dirname,"loginInfo.db");

let db = null;

const initializeDBAnsServer = async ()=>{
    try{
        db = await open({
            filename:dbPath,
            driver:sqlite3.Database,    
        })
        app.listen(3000,()=>{
            console.log("server is running at 3000")
        })
    }catch (e){
        console.log(`DB error: ${e}`)
        process.exit(1)
    }
}
initializeDBAnsServer();

//slash API
app.get('/',async(request,response)=>{
    response.send("It's working priya")
})

//User Register API
app.post('/register/',async(request,response)=>{
    const {username,name,password,gender,location} = request.body;
    const hashedPassword = await bcrypt.hash(password,10);
    const getUserQuery = `SELECT * FROM user WHERE username = '${username}'`;
    const dbUser = await db.get(getUserQuery)
    if(dbUser===undefined){
        const newUserQuery = `
        INSERT INTO
            user(username,name,password,gender,location)
        VALUES('${username}','${name}','${hashedPassword}','${gender}','${location}')`;
        await db.run(newUserQuery);
        response.send("User created successfully")
    }else{
        response.status(400);
        response.send("Username already exists")
    }
});

app.get('/bot/',async(request,response)=>{
    response.send('The path is changing')
})

//User Login Api
app.post('/login/',async(request,response)=>{
    console.log('login page')
    const {username,password} = request.body
    const getUserQuery = `SELECT*FROM user WHERE username = '${username}'`;
    const dbUser = await db.get(getUserQuery)
    if(dbUser===undefined){
        response.status(400);
        response.send("Username or Password is Incorrect")
    }else{
        const isPasswordCorrect = await bcrypt.compare(password,dbUser.password);
        if(isPasswordCorrect){
            const payload = {username}
            const jwttoken = jwt.sign(payload,"SECRET_TOKEN")
            response.send({jwttoken})
        }else{
            response.status(400);
            response.send("Invalid Password")
        }
    }
})

