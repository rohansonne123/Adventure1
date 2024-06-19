const data = require("../models/data.js");
const review=require("../models/review.js");

const dataCamping=require("../models/Camping.js");

module.exports.CampingreviewPost=async(req,res)=>{
    console.log("everthing working");
    console.log(req.body.review);
    const {id}=req.params;
    const newListing=await dataCamping.findById(id);
    const reviewData= new review(req.body.review);
    reviewData.author=req.user._id;
    console.log(reviewData);
    newListing.review.push(reviewData);
    await reviewData.save();
    await newListing.save();
    console.log(newListing);
    res.redirect(`/Camping/${id}`);
}

module.exports.CampingreviewDelete=async(req,res)=>{
    let{id,reviewId}=req.params;
    await review.findByIdAndDelete(reviewId);
    await dataCamping.findByIdAndUpdate(id,{$pull:{review:reviewId}});
    req.flash("success","deleted review sucessfully");
    res.redirect(`/Camping/${id}`);
};

