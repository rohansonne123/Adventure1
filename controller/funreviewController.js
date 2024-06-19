const review=require("../models/review.js");

const dataFun=require("../models/Fun.js");

module.exports.funreviewPost=async(req,res)=>{
    
    // console.log(req.body.review);
    const {id}=req.params;
    // console.log(id);
    const funListing=await dataFun.findById(id);
    const reviewDatafun= new review(req.body.review);
    console.log(reviewDatafun);
    console.log(funListing);
    reviewDatafun.author=req.user._id;
    funListing.review.push(reviewDatafun);
    await reviewDatafun.save();
    await funListing.save();
    console.log(funListing);
    res.redirect(`/Fun/${id}`);
}

module.exports.funreviewDelete=async(req,res)=>{
    let{id,reviewId}=req.params;
    await review.findByIdAndDelete(reviewId);
    await dataFun.findByIdAndUpdate(id,{$pull:{review:reviewId}});
    req.flash("success","deleted review sucessfully");
    res.redirect(`/Fun/${id}`);
};