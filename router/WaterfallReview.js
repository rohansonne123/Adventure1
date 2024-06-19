const express=require("express");
const app=express();
const mongoose=require("mongoose");
const review=require("../models/review.js");
const path=require("path");
const wrapAsync=require("../Utils/wrapAsync.js");
const {reviewSchema}=require("../Schema.js");
const router=express.Router({mergeParams:true});
const reviewController=require("../controller/WaterfallControllerReview.js");
const WaterfallreviewController=require("../controller/WaterfallControllerReview.js");

const {isloggedin,isAuthor}=require("../middleware.js");

const validatereview=(req,res,next)=>{
    const {error}=reviewSchema.validate(req.body.review);
    if(error){
        throw new ExpressError(400,error.message);
    }else{
        next();
    }
}


router.post("/",isloggedin,wrapAsync(WaterfallreviewController.WaterfallreviewPost));
router.delete("/:reviewId",isloggedin,isAuthor,wrapAsync(WaterfallreviewController.WaterfallreviewDelete));

module.exports=router;