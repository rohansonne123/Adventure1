const dataAgri=require("../models/Agri.js");
const mbxClient = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxClient({ accessToken:process.env.ACCESS_TOKEN });

module.exports.indexRoute=async(req,res)=>{
    let allListing=await dataAgri.find();
    res.render("./Agri/list.ejs",{allListing});
}

module.exports.newRoute=(req,res,next)=>{
    res.render("./Agri/new.ejs");
    
}

module.exports.newPost=async(req,res)=>{

    const response=await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
        .send();
    
   
    
    let newdata=new dataAgri(req.body.listing);
    newdata.image = req.files.map(file => ({
        path: file.path,
        filename: file.filename
    }));
    newdata.owner=req.user._id;
    newdata.geometry=response.body.features[0].geometry;
    await newdata.save();
   console.log(newdata);
   req.flash("success","adding new listing successfully");
    res.redirect("/Agri");
}

module.exports.showRoute=async(req,res)=>{
    let {id}=req.params;
    let details=await dataAgri.findById(id).populate({path:"review",populate:({path:"author"})}).populate("owner");
    if(!details){
        req.flash("error","listing you trying to access is not there");
        return res.redirect(`/Agri/${id}`);
    }
    
    res.render("./Agri/Show.ejs",{details});
}

module.exports.updateRoute=async(req,res)=>{
    let {id}=req.params;
    const listing=await dataAgri.findById(id);
    
    
    const editImageUrl = listing.image.map(image => {
        return image.path.replace("/upload", "/upload/h_300,w_250");
    });
    if(!listing){
        req.flash("error","Listing you access to edit is already deleted");
        res.redirect("/listing");

    }
   res.render("./Agri/edit.ejs",{editData,editImageUrl});
}

module.exports.updateput=async(req,res)=>{
    let {id}=req.params;
    const updatedListing=await dataAgri.findByIdAndUpdate(id,{...req.body.listing} );
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
   res.redirect(`/Agri/${id}`);
}

module.exports.deleteRoute=async(req,res)=>{
    let {id,hotelid,roomid}=req.params;
    let deletedListing=await dataAgri.findByIdAndDelete(id);
    //console.log(deletedListing);
    if(!deletedListing){
        req.flash("error","listing you trying to access is already deleted");
        return res.redirect(`/Agri/${id}`);
    }
    await dataAgri.findByIdAndUpdate(id,{$pull:{Hotel:hotelid}});
    await dataAgri.findByIdAndUpdate(id,{$pull:{Room:roomid}});
    req.flash("success","listing was deleted successfully");
    
    res.redirect("/Agri");
    
}