const express=require("express");
const app=express();
const mongoose=require("mongoose");
const dataFun=require("../models/Fun.js");
const path=require("path");
const wrapAsync=require("../Utils/wrapAsync.js");
const {FunserverSide}=require("../Schema.js");
const router=express.Router();
const {isloggedin,isOwnerfun}=require("../middleware.js");
const FunController=require("../controller/FunContoller.js");
const {storage}=require("../clodinary.js");
const multer  = require('multer');
const upload = multer({ storage}).array('image', 10);

const validateListing=(req,res,next)=>{
    const {error}=FunserverSide.validate(req.body);
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
        return res.redirect("/listing");
    }

    const listings = await dataFun.find({
        $or: [
            { title: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } },
            { location: { $regex: query, $options: 'i' } },
            { country: { $regex: query, $options: 'i' } }
        ]
    });

    res.render("./Fun/list.ejs", { allListing: listings });
}));

router.post("/:id/rate",isloggedin,wrapAsync(async(req,res,next)=>{
    let {id}=req.params;
     const listing= await dataFun.findById(id);
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
    res.redirect(`/Fun/${id}`);
}))

//index route
router.get("/",FunController.indexRoute);

//new route
router.get("/new",isloggedin,FunController.newRoute)
// router.post("/",upload.single('listing[image]'),(req,res)=>{
//     res.send(req.file);
// })
router.post("/"
,upload,wrapAsync(FunController.newPost)
)


//show route
router.get("/:id",FunController.showRoute)

//update route
router.get("/:id/edit",isloggedin,isOwnerfun,FunController.updateRoute)
router.put("/:id",upload,wrapAsync(FunController.updateput))

//delete listing
router.delete("/:id",isloggedin,isOwnerfun,FunController.deleteRoute);

module.exports=router;