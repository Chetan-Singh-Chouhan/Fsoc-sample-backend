const mongoose =require('mongoose')
const ObjectID= mongoose.Schema.Types.ObjectID
const blogsSchema = new mongoose.Schema({
    title:{
        type:String,
        required: true
    },
    body:{
        type:String,
        required: true
    },
    userId:{
        type: ObjectID,
        ref: "user",
        required: true
    },
    
    deletedAt:
    {
        type:Date
    },
    isDeleted:{
        type:Boolean,
        default:false
    },  
},{timestamps:true})
module.exports = mongoose.model("blog",blogsSchema) 