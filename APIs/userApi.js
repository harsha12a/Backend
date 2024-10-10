const exp = require('express');
const userApp=exp.Router();
const bcrypt = require('bcrypt');
const expressAsync=require('express-async-handler')
const jwt=require('jsonwebtoken')
const tokenVerify = require('../middlewares/tokenVerify');

userApp.get('/',tokenVerify,expressAsync(async(req,res)=>{
    const users=req.app.get('users')
    let arr=await users.find().toArray()
    res.send({message:'Hello User',payload:arr})
}))

userApp.get('/:nameUrl',tokenVerify,expressAsync(async(req,res)=>{
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
    let user=await users.findOne({name:data.nameUrl})
    if(user===null){
        res.send({message:'User already exists'})
    }
    else{
        try{
            let obj=data;
            obj.password=await bcrypt.hash(obj.password,10)
            await obj.save()
            res.send({message:'User registered',payload:data})
        }
        catch(err){
            console.log(err);
            res.send({message:'Error',error:err.message})
        }
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
        let areSame=await bcrypt.compare(password,user.password)
        if(areSame===true){
            let token=jwt.sign({name:nameUrl},process.env.SECRET_KEY,{expiresIn:'10h'})
            res.send({message:'Hello User',token:token,payload:user})
        }
        else
            res.send({message:'Invalid credentials'})
    }
}))

userApp.put('/update',tokenVerify,expressAsync(async(req,res)=>{
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

userApp.delete('/delete/:nameUrl',tokenVerify,expressAsync(async(req,res)=>{
    const users=req.app.get('users')
    let nameUrl=req.params.nameUrl
    let user=await users.findOne({name:nameUrl})
    if(user===null){
        res.send({message:'User not found'})
    }
    else{
            await users.deleteOne({name:nameUrl})
            res.send({message:'User deleted'})
    }
}))

userApp.post('/filter',tokenVerify,expressAsync(async(req,res)=>{
    let users=req.app.get('users')
    try{
        let filters=req.body.filters
        if(filters===undefined) res.send({message:"No filters"})
        let query={}
        filters?.forEach(({field,value})=>{
            if(field && value !== undefined){
                query[field]=value
            }
        })
        let arr=await users.find(query).toArray()
        if(arr.length===0) res.send({message:'User not found'})
        else res.send({message:'success',payload:arr})
    }
    catch(err){
        res.send({message:'Error',Error:err.message})
    }
}))

module.exports=userApp;