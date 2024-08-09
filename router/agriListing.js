const express=require("express");
const app=express();
const mongoose=require("mongoose");
const dataAgri=require("../models/Agri.js");
const path=require("path");
const wrapAsync=require("../Utils/wrapAsync.js");
const {AgriserverSide}=require("../Schema.js");
const router=express.Router();
const {isloggedin,isAuthor,isOwnerAgri}=require("../middleware.js");
const AgriController=require("../controller/AgriController.js");
const {storage}=require("../clodinary.js");
const multer  = require('multer');
const upload = multer({ storage}).array('image', 10);

const validateListing=(req,res,next)=>{
    const {error}=AgriserverSide.validate(req.body);
    if(error){
        throw new ExpressError(400,error.message);
    }else{
        next();
    }
}
router.post("/:id/rate",isloggedin,wrapAsync(async(req,res,next)=>{
    let {id}=req.params;
     const listing= await dataAgri.findById(id);
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
    res.redirect(`/Agri/${id}`);
}))
router.get("/search", wrapAsync(async (req, res) => {
    const { query } = req.query;
    console.log(query);
    if (!query || query=='') {
        
        return res.redirect("/Agri");
    }

    const allListing = await dataAgri.find({
        $or: [
            { title: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } },
            { location: { $regex: query, $options: 'i' } },
            { country: { $regex: query, $options: 'i' } }
        ]
    });

    res.render("./Agri/list.ejs", { alllist: allListing });
}));

//index route
router.get("/",AgriController.indexRoute);

//new route
router.get("/new",isloggedin,AgriController.newRoute)
// router.post("/",upload.single('listing[image]'),(req,res)=>{
//     res.send(req.file);
// })
router.post("/"
,upload,wrapAsync(AgriController.newPost)
)


//show route
router.get("/:id",AgriController.showRoute)

//update route
router.get("/:id/edit",isloggedin,isOwnerAgri,AgriController.updateRoute)
router.put("/:id",upload,wrapAsync(AgriController.updateput))

//delete listing
router.delete("/:id",isloggedin,isOwnerAgri,AgriController.deleteRoute);

module.exports=router;