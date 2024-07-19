const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const reviewSchema=require("./review.js");
let listingSchema=mongoose.Schema({
    title:String,
    description:String,
    price:{
        type:Number,
        required:true,
    },
    image:[{
        path:String,
        filename:String,
    }],
    location:String,
    country:String,
    review:[
        {
        type:Schema.Types.ObjectId,
        ref:"review",
        }
       ],
    owner:{
        type:Schema.Types.ObjectId,
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
    rating:[{
      type:Number,
      min:1,
      max:5,
  }],
  roundRate:{
    type:Number,
    min:1,
    max:5,
  },
  mobnumber:{
    type:Number,
  },
});

listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
      await reviewSchema.deleteMany({_id: {$in: listing.review}});
  }
})
const Waterfall=mongoose.model("Waterfall",listingSchema);

module.exports=Waterfall;