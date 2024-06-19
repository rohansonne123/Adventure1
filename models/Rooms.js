const reviewSchema=require("./review.js");
const mongoose=require("mongoose");
const schema=mongoose.Schema;
//const data=require("./data.js");
const listingSchema=new schema({
    title:String,
    description:String,
    image:[{
        path:String,
        filename:String,
    }],
    price:Number,
    review:[{
       type:schema.Types.ObjectId,
       ref:"review",
    }],
    location:String,
    country:String,
    owner:{
        type:schema.Types.ObjectId,
        ref:"User",
    },
    geometry: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true,
        },
        coordinates: {
          type: [Number],
          required: true,
        }
      },
    insta:[{
        type:String
    }],
    youtube:[{
       type:String,
    }],

})
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await reviewSchema.deleteMany({ _id: {$in: listing.review}});
    }
})
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await reviewSchema.deleteMany({ _id: {$in: listing.Room}});
    }
})
const Room=mongoose.model("Room",listingSchema);

module.exports=Room;