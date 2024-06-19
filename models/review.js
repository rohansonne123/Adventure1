const { number } = require("joi");
const mongoose=require("mongoose");
const data = require("./data.js");
const Schema=mongoose.Schema;

let reviewSchema= new Schema({
    comment:String,
    rating:{
        type:Number,
        min:1,
        max:5,
    },
    date:{
        type:Date,
        default:Date.now(),
    },
    author:{
            type:Schema.Types.ObjectId,
            ref:"User",
    }
});



module.exports=mongoose.model("review",reviewSchema);;