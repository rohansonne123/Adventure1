const express=require("express");
const app=express();
const mongoose=require("mongoose");
const review=require("../models/review.js");
const path=require("path");
const wrapAsync=require("../Utils/wrapAsync.js");
const {reviewSchema}=require("../Schema.js");
const router=express.Router({mergeParams:true});
const reviewController=require("../controller/campingReview.js");
const campingreviewController=require("../controller/campingReview.js");

const {isloggedin,isAuthor, isOwnerCamping}=require("../middleware.js");

const validatereview=(req,res,next)=>{
    const {error}=reviewSchema.validate(req.body.review);
    if(error){
        throw new ExpressError(400,error.message);
    }else{
        next();
    }
}


router.post("/",isloggedin,wrapAsync(campingreviewController.CampingreviewPost));
router.delete("/:reviewId",isloggedin,isAuthor,wrapAsync(campingreviewController.CampingreviewDelete));

module.exports=router;