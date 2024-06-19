const data = require("../models/data.js");
const review=require("../models/review.js");

const dataAgri=require("../models/Agri.js");

module.exports.reviewPost=async(req,res)=>{
    console.log("everthing working");
    console.log(req.body.review);
    const {id}=req.params;
    const newListing=await data.findById(id);
    const reviewData= new review(req.body.review);
    reviewData.author=req.user._id;
    console.log(reviewData);
    newListing.review.push(reviewData);
    await reviewData.save();
    await newListing.save();
    console.log(newListing);
    res.redirect(`/listing/${id}`);
}

module.exports.reviewDelete=async(req,res)=>{
    let{id,reviewId}=req.params;
    await review.findByIdAndDelete(reviewId);
    await data.findByIdAndUpdate(id,{$pull:{review:reviewId}});
    req.flash("success","deleted review sucessfully");
    res.redirect(`/listing/${id}`);
};

