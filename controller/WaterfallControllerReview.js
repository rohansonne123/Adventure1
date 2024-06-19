const data = require("../models/data.js");
const review=require("../models/review.js");

const dataWaterfall=require("../models/Waterfall.js");

module.exports.WaterfallreviewPost=async(req,res)=>{
    console.log("everthing working");
    console.log(req.body.review);
    const {id}=req.params;
    const newListing=await dataWaterfall.findById(id);
    const reviewData= new review(req.body.review);
    reviewData.author=req.user._id;
    console.log(reviewData);
    newListing.review.push(reviewData);
    await reviewData.save();
    await newListing.save();
    console.log(newListing);
    res.redirect(`/Waterfall/${id}`);
}

module.exports.WaterfallreviewDelete=async(req,res)=>{
    let{id,reviewId}=req.params;
    await review.findByIdAndDelete(reviewId);
    await dataWaterfall.findByIdAndUpdate(id,{$pull:{review:reviewId}});
    req.flash("success","deleted review sucessfully");
    res.redirect(`/Waterfall/${id}`);
};