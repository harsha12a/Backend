const exp = require('express');
const userApp=exp.Router();
const User=require('../Models/userModel')

userApp.get('/',async(req,res)=>{
    const users=req.app.get('users')
    let arr=await users.find().toArray()
    res.send({message:'Hello User',payload:arr})
})

userApp.get('/:username',async(req,res)=>{
    const users=req.app.get('users')
    let {username}=req.params
    let user=await users.findOne({name:username})
    if(user===null){
        res.send({message:'User not found'})
    }
    else
        res.send({message:'Hello User',payload:user})
})

userApp.post('/register',async(req,res)=>{
    const users=req.app.get('users')
    let data=req.body
    try{
        let obj=new User(data)
        await obj.save()
        res.send({message:'User registered',payload:data})
    }
    catch(err){
        console.log(err);
        res.send({message:'Error occured',error:err.message})
    }
})

userApp.post('/login',async(req,res)=>{
    const users=req.app.get('users')
    let {username,password}=req.body
    let user=await users.findOne({name:username})
    if(user===null){
        res.send({message:'User not found'})
    }
    else{
        if(password===user.password)
            res.send({message:'Hello User',payload:user})
        else
            res.send({message:'Invalid credentials'})
    }
})

userApp.put('/update',async(req,res)=>{
    const users=req.app.get('users')
    let username=req.body
    let user=await users.findOne({name:{$eq:username}})
    if(user===null){
        res.send({message:'User not found'})
    }
    else{
        await users.updateOne({name:{$eq:username}},{$set:{...user}})
        res.send({message:'User updated',payload:users})
    }
})

userApp.delete('/delete',(req,res)=>{
    const users=req.app.get('users')
    let {username,password}=req.body
    let user=users.findOne({name:username})
    if(user===null){
        res.send({message:'User not found'})
    }
    else{
            users.deleteOne({name:username})
            res.send({message:'User deleted'})
    }
})

module.exports=userApp;