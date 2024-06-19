const express=require("express");
const app=express();
const mongoose=require("mongoose");
const review=require("../models/review.js");
const path=require("path");
const wrapAsync=require("../Utils/wrapAsync.js");
const {reviewSchema}=require("../Schema.js");
const router=express.Router({mergeParams:true});
const reviewController=require("../controller/reviewController.js");
const funreviewController=require("../controller/funreviewController.js");
const ListingHotels=require("../models/Hotel.js");
const ListingRooms=require("../models/Rooms.js");


const {isloggedin,isAuthor, isOwnerfun}=require("../middleware.js");

const validatereview=(req,res,next)=>{
    const {error}=reviewSchema.validate(req.body.review);
    if(error){
        throw new ExpressError(400,error.message);
    }else{
        next();
    }
}


router.post("funreview",isloggedin,wrapAsync(funreviewController.funreviewPost));
router.delete("funreview/:reviewId",isloggedin,isAuthor,wrapAsync(funreviewController.funreviewDelete));

router.post("/rooms/:roomid/review",isloggedin,wrapAsync(async(req,res,next)=>{
    let {id,roomid}=req.params;
     const listing= await ListingRooms.findById(roomid);
     const newreview=new review(req.body.review);
     newreview.author=req.user._id;
     listing.review.push(newreview);

    await newreview.save();
    await listing.save();
    req.flash("success","added review sucessfully")
    res.redirect(`/Fun/${id}/rooms/${roomid}`);
}))

//delete review route
router.delete("/rooms/:roomid/review/:reviewId",isloggedin,isAuthor,wrapAsync(async(req,res)=>{
    let {id,roomid,reviewId}=req.params;
    await review.findByIdAndDelete(reviewId);
    await ListingRooms.findByIdAndUpdate(roomid,{$pull:{review:reviewId}});
    req.flash("success","deleted review sucessfully");
    res.redirect(`/Fun/${id}/rooms/${roomid}`);
}))

router.post("/hotels/:hotelid/reviews",isloggedin,wrapAsync(async(req,res,next)=>{
    let {id,hotelid}=req.params;
     const listing= await ListingHotels.findById(hotelid);
     const newreview=new review(req.body.review);
     newreview.author=req.user._id;
     listing.review.push(newreview);

    await newreview.save();
    await listing.save();
    req.flash("sucess","added review sucessfully")
    res.redirect(`/Fun/${id}/hotels/${hotelid}`);
}))

//delete review route
router.delete("/hotels/:hotelid/reviews/:reviewId",isloggedin,isAuthor,wrapAsync(async(req,res)=>{
    let {id,hotelid,reviewId}=req.params;
    await review.findByIdAndDelete(reviewId);
    await ListingHotels.findByIdAndUpdate(hotelid,{$pull:{review:reviewId}});
    req.flash("success","deleted review sucessfully");
    res.redirect(`/Fun/${id}/hotels/${hotelid}`);
}))
module.exports=router;