const { default: mongoose} = require("mongoose")
const propertySchema = require('./propertyModel');
let {Schema}=mongoose
const userSchema=new Schema({
    name:{
        type:String,
        required:[true,'name is required']
    },
    age:{
        type:Number,
        required:[true,'age is required'],
        min:[0,'age can not be negative']
    },
    email:{
        type:String,
        required:[true,'email is required'],
        unique:true,
        match:[/.+@.+\..+/,'invalid email']
    },
    password:{
        type:String,
        required:[true,'password is required']
    },
    role:{
        type:String,
        enum:{values:['user','merchant'],message: 'Role must be either "user" or "merchant"'},
        required:[true,'role is required']
    },
    address:{
        city:{
            type:String,
            required:[true,'city is required']
        },
        state:{
            type:String,
            required:[true,'state is required']
        }
    },
    wishlist:[propertySchema],
    properties:[propertySchema]
})

const User=mongoose.model('users',userSchema)
module.exports=User