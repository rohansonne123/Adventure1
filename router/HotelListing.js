

const dataAgri=require("../models/Hotel.js");
const mbxClient = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxClient({ accessToken:process.env.ACCESS_TOKEN });
const express=require("express");
const app=express();
const router=express.Router();
const passport=require("passport");
const Listing=require("../models/Hotel.js");
const OrignListing=require("../models/data.js");
const wrapAsync=require("../Utils/wrapAsync.js");
const ExpressError=require("../Utils/ExpressError.js");

const {listingValidation,reviewValidation}=require("../Schema.js");
const {isloggedin,isOwwner}=require("../middleware.js");
const {storage}=require("../clodinary.js");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const multer  = require('multer');
const upload = multer({storage }).array('image', 10);
// const uploadMultiple=upload.fields([{name:'listing[image]',maxCount:5}]);

router.get("/:id/hotels/search", wrapAsync(async (req, res) => {
    const { query } = req.query;
    let {id}=req.params;
    const list1=await OrignListing.findById(id).populate({path:"review",populate:({path:"author"})}).populate("owner").populate("Hotel");
    if (!query) {
        req.flash("error", "Please enter a search term");
        return res.redirect("/listing");
    }
    const listing=await list1.Hotel;
    console.log(listing)
    const listings = await listing.find({
        $or: [
            { title: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } },
            { location: { $regex: query, $options: 'i' } },
            { country: { $regex: query, $options: 'i' } }
        ]
    });
    
    res.render("./Hotel/index.ejs", { list: listings,id });
}));
//add new route
router.get("/:id/hotels/new",isloggedin,wrapAsync(async(req,res,next)=>{
    let {id}=req.params;
    console.log(id);
    const listing=await OrignListing.findById(id);

    res.render("./Hotel/add.ejs",{id});
    
    
}))
router.get("/:id/hotels/:hotelid/edit",upload,isloggedin,wrapAsync(async(req,res)=>{
   
    let {id,hotelid}=req.params;
    const listing=await Listing.findById(hotelid);
    
    
    const editImageUrl = listing.image.map(image => {
        return image.path.replace("/upload", "/upload/h_300,w_250");
    });
    if(!listing){
        req.flash("error","Listing you access to edit is already deleted");
        res.redirect(`/listing/${id}/hotels`);

    }
    res.render("./Hotel/update.ejs",{id,listing,editImageUrl});
}))
router.post("/:id/hotels",upload,wrapAsync(async(req,res)=>{
    const response= await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
        .send()
        
//    console.log(response.body.features);
//    res.send("done");
    
    let {id}=req.params;
    const newlisting=new Listing(req.body.listing);
    const listing=await OrignListing.findById(id);
    newlisting.image = req.files.map(file => ({
        path: file.path,
        filename: file.filename
    }));
    
    newlisting.owner=req.user._id;
    newlisting.geometry=response.body.features[0].geometry;
    listing.Hotel.push(newlisting);
    await newlisting.save();
    await listing.save();
    console.log(newlisting);
    req.flash("success","new listing added sucessfully");
    res.redirect(`/listing/${id}/hotels`);
}))



//show route
router.get("/:id/hotels/:hotelid",wrapAsync(async(req,res)=>{
    let {id,hotelid}=req.params;
    const Orignlist=await OrignListing.findById(id).populate("Hotel").populate({path:"review",populate:({path:"author"})}).populate("owner");
    const list= await Listing.findById(hotelid).populate({path:"review",populate:({path:"author"})}).populate("owner");
    if(!list){
        req.flash("error","Listing you access is already deleted");
        res.redirect(`/listing/${id}/hotels`);

    }
        res.render("./Hotel/show.ejs",{id,list,Orignlist});
    
    
}))

//update
router.put("/:id/hotels/:hotelid",upload,wrapAsync(async(req,res,next)=>{
    // let {error}=listingValidation.validate(req.body);
    // console.log(error);
    // if(error){
    //      throw new ExpressError(400,error);
    // }else{
    //     next();
    // }
    let {id,hotelid}=req.params;
    const updatedListing=await Listing.findByIdAndUpdate(hotelid,{...req.body.list} );
    if (req.files && req.files.length > 0) {
        const newImages = req.files.map(file => ({
            path: file.path,
            filename: file.filename
        }));
        updatedListing.image.push(...newImages); // Add new images to existing ones
        await updatedListing.save();
    }
    
    req.flash("success","Listing updated sucessfully");
    res.redirect(`/listing/${id}/hotels/${hotelid}`);
}))

router.delete("/:id/hotels/:hotelid",isloggedin,wrapAsync(async(req,res)=>{
    let {id,hotelid}=req.params;
    const list=await Listing.findByIdAndDelete(hotelid);
    
    req.flash("success","Listing Deleted sucessfully");
    res.redirect(`/listing/${id}/hotels`);
    
}))

//new route
router.get("/:id/hotels",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    res.locals.currId = req.path; // Set the local variable for currId
  res.locals.currPath = req.path;
    const alllist=await Listing.find({});
    const list1=await OrignListing.findById(id).populate({path:"review",populate:({path:"author"})}).populate("owner").populate("Hotel");
    console.log(alllist);
    const list=list1.Hotel;
    //res.send();
   res.render("./Hotel/index.ejs",{list,id});
}) )

module.exports=router;