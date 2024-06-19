const express=require("express");
const app=express();
const mongoose=require("mongoose");
const data=require("../models/data.js");
const Listing=require("../models/Waterfall.js")
const path=require("path");
const wrapAsync=require("../Utils/wrapAsync.js");
const {serverSide}=require("../Schema.js");
const router=express.Router();
const {isloggedin, isOwnerWaterfall}=require("../middleware.js");
const controllerListing=require("../controller/WaterfallController.js");
const {storage}=require("../clodinary.js");
const multer  = require('multer');
const upload = multer({ storage}).array('image', 10);

const validateListing=(req,res,next)=>{
    const {error}=serverSide.validate(req.body);
    if(error){
        throw new ExpressError(400,error.message);
    }else{
        next();
    }
}

router.get("/search", wrapAsync(async (req, res) => {
    const { query } = req.query;
    console.log(query);
    if (!query) {
        req.flash("error", "Please enter a search term");
        return res.redirect("/Waterfall");
    }

    const listings = await Listing.find({
        $or: [
            { title: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } },
            { location: { $regex: query, $options: 'i' } },
            { country: { $regex: query, $options: 'i' } }
        ]
    });

    res.render("./Waterfall/list.ejs", { allListing: listings });
}));

router.post("/:id/rate",isloggedin,wrapAsync(async(req,res,next)=>{
    let {id}=req.params;
     const listing= await Listing.findById(id);
     listing.rating.push((req.body.rating1));
     let count=0;
    let j=0;
    for(let i in listing.rating){
        
       j=j+listing.rating[i];
       count++;
    }
    
    let rate=Math.round(j/count);
    listing.roundRate=rate;
     

    
    await listing.save();
    res.redirect(`/Waterfall/${id}`);
})) 

//index route
router.get("/",controllerListing.indexRoute);

//new route
router.get("/new",isloggedin,controllerListing.newRoute)
// router.post("/",upload.single('listing[image]'),(req,res)=>{
//     res.send(req.file);
// })
router.post("/"
,upload,wrapAsync(controllerListing.newPost)
)


//show route
router.get("/:id",controllerListing.showRoute)

//update route
router.get("/:id/edit",upload,isloggedin,isOwnerWaterfall,controllerListing.updateRoute)
router.put("/:id",upload,wrapAsync(controllerListing.updateput))

//delete listing
router.delete("/:id",isloggedin,isOwnerWaterfall,controllerListing.deleteRoute);

module.exports=router;