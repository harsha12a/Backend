const exp = require('express');
const agentApp=exp.Router();

agentApp.get('/agents',async(req,res)=>{
    const users=req.app.get('agents')
    let arr=await users.find().toArray()
    res.send({message:'Hello User',payload:arr})
})

module.exports=agentApp