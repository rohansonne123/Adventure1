const dataFun=require("../models/Fun.js");
const mbxClient = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxClient({ accessToken:process.env.ACCESS_TOKEN });

module.exports.indexRoute=async(req,res)=>{
    let allListing=await dataFun.find();
    res.render("./Fun/list.ejs",{allListing});
}

module.exports.newRoute=(req,res,next)=>{
    res.render("./Fun/new.ejs");
    
}

module.exports.newPost=async(req,res)=>{

    const response=await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
        .send();
    
        let newdata=new dataFun(req.body.listing);
        newdata.image = req.files.map(file => ({
            path: file.path,
            filename: file.filename
        }));
    
   
    newdata.geometry=response.body.features[0].geometry;
    newdata.owner=req.user._id;
    await newdata.save();
   console.log(newdata);
   req.flash("success","adding new listing successfully");
    res.redirect("/Fun");
}

module.exports.showRoute=async(req,res)=>{
    let {id}=req.params;
    let details=await dataFun.findById(id).populate({path:"review",populate:({path:"author"})}).populate("owner");
    if(!details){
        req.flash("error","listing you trying to access is not there");
        return res.redirect(`/Fun/${id}`);
    }
    res.render("./Fun/Show.ejs",{details});
}

module.exports.updateRoute=async(req,res)=>{
    let {id}=req.params;
    let editData=await dataFun.findById(id);
    //console.log(editData);
    const editImageUrl = editData.image.map(image => {
     return image.path.replace("/upload", "/upload/h_300,w_250");
     });
    if(!editData){
        req.flash("error","Listing you access to edit is already deleted");
        res.redirect("/Camping");
    
    }
    
   res.render("./Fun/edit.ejs",{editData,editImageUrl});
}

module.exports.updateput=async(req,res)=>{
    let {id}=req.params;
    if(!req.body.listing){
        throw new ExpressError(401,"please add valid info");
    }
    const updatedListing=await dataFun.findByIdAndUpdate(id,{...req.body.listing} );
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
   res.redirect(`/Fun/${id}`);
}

module.exports.deleteRoute=async(req,res)=>{
    let {id,hotelid,roomid}=req.params;
    let deletedListing=await dataFun.findByIdAndDelete(id);
    if(!deletedListing){
        req.flash("error","listing you trying to access is already deleted");
        return res.redirect("/Camping");
    }
    await dataFun.findByIdAndUpdate(id,{$pull:{Room:roomid}});
    await dataFun.findByIdAndUpdate(id,{$pull:{Hotel:hotelid}});
    //console.log(deletedListing);
    req.flash("success","listing was deleted successfully");
    // req.flash("error","listing was not found it already deleted");
    res.redirect("/Fun");
    
}