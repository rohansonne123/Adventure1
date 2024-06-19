
const review=require("../models/review.js");

const dataAgri=require("../models/Agri.js");



module.exports.agrireviewPost=async(req,res)=>{
    
    console.log(req.body.review);
    const {id}=req.params;
    // console.log(id);
    const funListing=await dataAgri.findById(id);
    const reviewDatafun= new review(req.body.review);
    reviewDatafun.author=req.user._id;
    console.log(reviewDatafun);
    console.log(funListing);
    funListing.review.push(reviewDatafun);
    await reviewDatafun.save();
    await funListing.save();
    console.log(funListing);
    req.flash("success","added review successfully");
    res.redirect(`/Agri/${id}`);
    
}

module.exports.agrireviewDelete=async(req,res)=>{
    let{id,reviewId}=req.params;
    await review.findByIdAndDelete(reviewId);
    await dataAgri.findByIdAndUpdate(id,{$pull:{review:reviewId}});
    req.flash("success","deleted review sucessfully");
    res.redirect(`/Agri/${id}`);
};