const jwt = require('jsonwebtoken');

let tokenVerify=((req,res,next)=>{
    let bearerToken=req.headers.authorization
    if(bearerToken===undefined){
        return res.send({message:'Unauthorized access'})
    }
    let token=bearerToken.split(' ')[1]
    try{
        let decoded=jwt.verify(token,process.env.SECRET_KEY)
        next()
    }
    catch(err){
        return res.send({message:'Token expired'})
    }
})

module.exports=tokenVerify