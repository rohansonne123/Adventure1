const data=require("../models/data.js");
const mbxClient = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxClient({ accessToken:process.env.ACCESS_TOKEN });

module.exports.indexRoute=async(req,res)=>{
    let allListing=await data.find();
    res.render("./listings/list.ejs",{allListing});
}

module.exports.newRoute=(req,res,next)=>{
    res.render("./listings/new.ejs");
    
}

module.exports.newPost=async(req,res)=>{

    const response=await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
        .send();
    
        let newdata=new data(req.body.listing);
        newdata.image = req.files.map(file => ({
            path: file.path,
            filename: file.filename
        }));
    newdata.owner=req.user._id;
    newdata.geometry=response.body.features[0].geometry;
    await newdata.save();
   console.log(newdata);
   req.flash("success","adding new listing successfully");
    res.redirect("/listing");
}

module.exports.showRoute=async(req,res)=>{
    let {id}=req.params;
    
    let details=await data.findById(id).populate({path:"review",populate:({path:"author"})}).populate("owner");
    
    if(!details){
        req.flash("error","listing you trying to access is not there");
        return res.redirect(`/listing/${id}`);
    }
    res.render("./listings/Show.ejs",{details});
}

module.exports.updateRoute=async(req,res)=>{
    let {id}=req.params;
    let editData=await data.findById(id);
    //console.log(editData);
    const editImageUrl = editData.image.map(image => {
     return image.path.replace("/upload", "/upload/h_300,w_250");
     });
    if(!editData){
        req.flash("error","Listing you access to edit is already deleted");
        res.redirect("/listing");
    
    }
   res.render("./listings/edit.ejs",{editData,editImageUrl});
}

module.exports.updateput=async(req,res)=>{
    let {id}=req.params;
    if(!req.body.listing){
        throw new ExpressError(401,"please add valid info");
    }
    
    const updatedListing=await data.findByIdAndUpdate(id,{...req.body.listing} );
    if (req.files && req.files.length > 0) {
        const newImages = req.files.map(file => ({
            path: file.path,
            filename: file.filename
        }));
        updatedListing.image.push(...newImages); // Add new images to existing ones
        await updatedListing.save();
    }
    
    req.flash("success","updated given listing successfully");
   //console.log(afterEdit);
   res.redirect(`/listing/${id}`);
}

module.exports.deleteRoute=async(req,res)=>{
    let {id,roomid,hotelid}=req.params;
    let deletedListing=await data.findByIdAndDelete(id);
    if(!deletedListing){
        res.flash("error","listing you trying to access is already deleted");
        return res.redirect(`/listing/${id}`);
    }
    //console.log(deletedListing);
    await data.findByIdAndUpdate(id,{$pull:{Room:roomid}});
    await data.findByIdAndUpdate(id,{$pull:{Hotel:hotelid}});
    req.flash("success","listing was deleted successfully");
    res.redirect("/listing");
    
}