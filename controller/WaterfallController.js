const dataWaterfall=require("../models/Waterfall.js");
const mbxClient = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxClient({ accessToken:process.env.ACCESS_TOKEN });

module.exports.indexRoute=async(req,res)=>{
    let allListing=await dataWaterfall.find();
    res.render("./Waterfall/list.ejs",{allListing});
}

module.exports.newRoute=(req,res,next)=>{
    res.render("./Waterfall/new.ejs");
    
}

module.exports.newPost=async(req,res)=>{

    const response=await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
        .send();
    
        let newdata=new dataWaterfall(req.body.listing);
        newdata.image = req.files.map(file => ({
            path: file.path,
            filename: file.filename
        }));
    newdata.owner=req.user._id;
    newdata.geometry=response.body.features[0].geometry;
    await newdata.save();
   console.log(newdata);
   req.flash("success","adding new listing successfully");
    res.redirect("/Waterfall");
}

module.exports.showRoute=async(req,res)=>{
    let {id}=req.params;
    let details=await dataWaterfall.findById(id).populate({path:"review",populate:({path:"author"})}).populate("owner");
    if(!details){
        req.flash("error","listing you trying to access is not there");
        return res.redirect(`/listing/${id}`);
    }
    res.render("./Waterfall/Show.ejs",{details});
}

module.exports.updateRoute=async(req,res)=>{
    let {id}=req.params;
    let editData=await dataWaterfall.findById(id);
    //console.log(editData);
    const editImageUrl = editData.image.map(image => {
     return image.path.replace("/upload", "/upload/h_300,w_250");
     });
    if(!editData){
        req.flash("error","Listing you access to edit is already deleted");
        res.redirect("/Waterfall");
    
    }
   res.render("./Waterfall/edit.ejs",{editData,editImageUrl});
}

module.exports.updateput=async(req,res)=>{
    let {id}=req.params;
    if(!req.body.listing){
        throw new ExpressError(401,"please add valid info");
    }
    
    const updatedListing=await data.findByIdAndUpdate(id,{...req.body.list} );
    if (req.files && req.files.length > 0) {
        const newImages = req.files.map(file => ({
            path: file.path,
            filename: file.filename
        }));
        updatedListing.images.push(...newImages); // Add new images to existing ones
        await updatedListing.save();
    }
    
    req.flash("success","updated given listing successfully");
   //console.log(afterEdit);
   res.redirect(`/Waterfall/${id}`);
}

module.exports.deleteRoute=async(req,res)=>{
    let {id}=req.params;
    let deletedListing=await dataWaterfall.findByIdAndDelete(id);
    if(!deletedListing){
        req.flash("error","listing you trying to access is already deleted");
        return res.redirect(`/Waterfall/${id}`);
    }
    //console.log(deletedListing);
    req.flash("success","listing was deleted successfully");
    res.redirect("/Waterfall");
    
}