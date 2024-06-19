

const dataAgri=require("../models/Hotel.js");
const mbxClient = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxClient({ accessToken:process.env.ACCESS_TOKEN });
const express=require("express");
const app=express();
const router=express.Router();
const passport=require("passport");
const Listing=require("../models/Rooms.js");
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

// router.get("/search", wrapAsync(async (req, res) => {
//     const { query } = req.query;
//     console.log(query);
//     if (!query) {
//         req.flash("error", "Please enter a search term");
//         return res.redirect("/listing");
//     }

//     const listings = await Listing.find({
//         $or: [
//             { title: { $regex: query, $options: 'i' } },
//             { description: { $regex: query, $options: 'i' } },
//             { location: { $regex: query, $options: 'i' } },
//             { country: { $regex: query, $options: 'i' } }
//         ]
//     });

//     res.render("./Hotel/index.ejs", { alllist: listings });
// }));
//add new route
router.get("/:id/rooms/new",isloggedin,wrapAsync(async(req,res,next)=>{
    let {id}=req.params;
    console.log(id);
    const listing=await OrignListing.findById(id);

    res.render("./Room/add.ejs",{id});
    
    
}))
router.get("/:id/rooms/:roomid/edit",upload,isloggedin,wrapAsync(async(req,res)=>{
   
    let {id,roomid}=req.params;
    const listing=await Listing.findById(roomid);
    
    
    const editImageUrl = listing.image.map(image => {
        return image.path.replace("/upload", "/upload/h_300,w_250");
    });
    if(!listing){
        req.flash("error","Listing you access to edit is already deleted");
        res.redirect(`/listing/${id}/rooms`);

    }
    res.render("./Room/update.ejs",{id,listing,editImageUrl});
}))
router.post("/:id/rooms",upload,wrapAsync(async(req,res)=>{
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
    // newlisting.geometry={ type: 'Point', coordinates: [ -155.134023, 19.698738 ]};
    listing.Room.push(newlisting);
    await newlisting.save();
    await listing.save();
    console.log(newlisting);
    req.flash("success","new listing added sucessfully");
    res.redirect(`/listing/${id}/rooms`);
}))



//show route
router.get("/:id/rooms/:roomid",wrapAsync(async(req,res)=>{
    let {id,roomid}=req.params;
    const Orignlist=await OrignListing.findById(id).populate("Room").populate({path:"review",populate:({path:"author"})}).populate("owner");
    const list= await Listing.findById(roomid).populate({path:"review",populate:({path:"author"})}).populate("owner");
    if(!list){
        req.flash("error","Listing you access is already deleted");
        res.redirect(`/listing/${id}/rooms`);

    }
        res.render("./Room/show.ejs",{id,list,Orignlist});
    
    
}))

//update
router.put("/:id/rooms/:roomid",upload,wrapAsync(async(req,res,next)=>{
    // let {error}=listingValidation.validate(req.body);
    // console.log(error);
    // if(error){
    //      throw new ExpressError(400,error);
    // }else{
    //     next();
    // }
    let {roomid}=req.params;
    const updatedListing=await Listing.findByIdAndUpdate(roomid,{...req.body.list} );
    if (req.files && req.files.length > 0) {
        const newImages = req.files.map(file => ({
            path: file.path,
            filename: file.filename
        }));
        updatedListing.image.push(...newImages); // Add new images to existing ones
        await updatedListing.save();
    }
    
    req.flash("success","Listing updated sucessfully");
    res.redirect(`/listing/${id}/rooms/${roomid}`);
}))

router.delete("/:id/rooms/:roomid",isloggedin,wrapAsync(async(req,res)=>{
    let {roomid}=req.params;
    const list=await Listing.findByIdAndDelete(roomid);
    
    req.flash("success","Listing Deleted sucessfully");
    res.redirect(`/listing/${id}/rooms`);
    
}))

//new route
router.get("/:id/rooms",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const alllist=await Listing.find({});
    const list=await OrignListing.findById(id).populate({path:"review",populate:({path:"author"})}).populate("owner").populate("Room");
    console.log(alllist);
    //res.send();
   res.render("./Room/index.ejs",{list,id});
}) )

module.exports=router;