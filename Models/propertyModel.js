const { default: mongoose } = require("mongoose")
let {Schema}=mongoose
const propertySchema=new Schema({
    type:{
        type:String,
        enum:['flat','hostel','land'],
    },
    details:{
        location:{
            type:String,
        },
        price:{
            type:Number,
        },
        image:{
            type:String,
        }
    }
})

module.exports=propertySchema