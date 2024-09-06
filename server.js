const exp = require('express');
const app=exp()
app.use(exp.json())
require('dotenv').config()
const {MongoClient}=require('mongodb')
require('./db')

const port=(process.env.PORT)
const userApp = require('./APIs/userApi');
const merchantApp = require('./APIs/merchantApi');

let mClient=new MongoClient(process.env.MONGO)
mClient.connect().then((obj)=>{
    let flat=obj.db('find')
    let users=flat.collection('users')
    app.set('users',users)
    console.log('Connected to db');
    app.listen(port,()=>{
        console.log(`Port at ${port}`);
    })
}).catch((err)=>{
    console.log('error in connecting',err);
})
app.use('/user',userApp)
app.use('/merchant',merchantApp)

app.use('*',(req,res)=>{
    res.send({message:'Page not found'})
})

app.use((err,req,res,next)=>{
    console.log(err)
    res.send({message:'Something went wrong'})
})

