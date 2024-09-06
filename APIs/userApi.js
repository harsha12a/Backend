const exp = require('express');
const userApp=exp.Router();
const User=require('../Models/userModel')
const bcrypt = require('bcrypt');
const expressAsync=require('express-async-handler')
const jwt=require('jsonwebtoken')
const tokenVerify = require('../middlewares/tokenVerify');

userApp.get('/',tokenVerify,expressAsync(async(req,res)=>{
    const users=req.app.get('users')
    let arr=await users.find().toArray()
    res.send({message:'Hello User',payload:arr})
}))

userApp.get('/:nameUrl',expressAsync(async(req,res)=>{
    const users=req.app.get('users')
    let {nameUrl}=req.params
    let user=await users.findOne({name:nameUrl})
    if(user===null){
        res.send({message:'User not found'})
    }
    else
        res.send({message:'Hello User',payload:user})
}))

userApp.post('/register',expressAsync(async(req,res)=>{
    const users=req.app.get('users')
    let data=req.body
    
    try{
        let obj=new User(data)
        obj.password=await bcrypt.hash(obj.password,10)
        await obj.save()
        res.send({message:'User registered',payload:data})
    }
    catch(err){
        console.log(err);
        res.send({message:'Error occured',error:err.message})
    }
}))

userApp.post('/login',expressAsync(async(req,res)=>{
    const users=req.app.get('users')
    let {nameUrl,password}=req.body
    let user=await users.findOne({name:nameUrl})
    if(user===null){
        res.send({message:'User not found'})
    }
    else{
        let res1=await bcrypt.compare(password,user.password)
        if(res1===true){
            let token=jwt.sign({name:nameUrl},process.env.SECRET_KEY,{expiresIn:'20s'})
            res.send({message:'Hello User',payload:user,token:token})
        }
        else
            res.send({message:'Invalid credentials'})
    }
}))

userApp.put('/update',expressAsync(async(req,res)=>{
    const users=req.app.get('users')
    let newUser=req.body
    let user=await users.findOne({name:{$eq:newUser.nameUrl}})
    if(user===null){
        res.send({message:'User not found'})
    }
    else{
        await users.updateOne({name:{$eq:newUser.nameUrl}},{$set:{...newUser}})
        res.send({message:'User updated',payload:newUser})
    }
}))

userApp.delete('/delete/:nameUrl',expressAsync((req,res)=>{
    const users=req.app.get('users')
    let nameUrl=req.params.nameUrl
    let user=users.findOne({name:nameUrl})
    if(user===null){
        res.send({message:'User not found'})
    }
    else{
            users.deleteOne({name:nameUrl})
            res.send({message:'User deleted'})
    }
}))

module.exports=userApp;