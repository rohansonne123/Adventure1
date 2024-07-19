
const dataFun = require("./models/Fun.js");
const data=require("./models/data.js");
const dataAgri=require("./models/Agri.js");
const dataCamping=require("./models/Camping.js");
const dataWaterfall=require("./models/Waterfall.js");
const review=require("./models/review.js");

module.exports.isloggedin=(req,res,next)=>{
    console.log(req.path);
    if(!req.isAuthenticated()){
        req.session.redirecturl=req.originalUrl;
       req.flash("success","please login to the wanderlust");
       return res.redirect("/login");
    }
    next();
}

module.exports.urlredirect=(req,res,next)=>{
   if(req.session.redirecturl){
    res.locals.urlpath=req.session.redirecturl;
   }
   next();
}


module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let listing=await data.findById(id);
    if(!listing && !listing.owner.equals(req.user._id)){
        req.flash("error","you are not the owner of current listing");
        return res.redirect(`/listing/${id}`);
    }
    next();
}

module.exports.isAuthor=async(req,res,next)=>{
    let {id,reviewId}=req.params;
    let listingreview=await review.findById(reviewId);
    if(!listingreview && !listingreview.author.equals(req.user._id)){
        req.flash("error","you does not create given comment");
        return res.redirect("/listing");
    }
    next();
}


module.exports.isOwnerfun=async(req,res,next)=>{
    let {id}=req.params;
    let listing=await dataFun.findById(id);
    if(!listing && !listing.owner.equals(req.user._id)){
        req.flash("error","you are not the owner of current listing");
        return res.redirect(`/Fun/${id}`);
    }
    next();
}

module.exports.isOwnerAgri=async(req,res,next)=>{
    let {id}=req.params;
    let listing=await dataAgri.findById(id);
    if(!listing && !listing.owner.equals(req.user._id)){
        req.flash("error","you are not the owner of current listing");
        return res.redirect(`/Agri/${id}`);
    }
    next();
}

module.exports.isOwnerCamping=async(req,res,next)=>{
    let {id}=req.params;
    let listing=await dataCamping.findById(id);
    if(!listing && !listing.owner.equals(req.user._id)){
        req.flash("error","you are not the owner of current listing");
        return res.redirect(`/Camping/${id}`);
    }
    next();
}
module.exports.isOwnerWaterfall=async(req,res,next)=>{
    let {id}=req.params;
    let listing=await dataWaterfall.findById(id);
    if(!listing && !listing.owner.equals(req.user._id)){
        req.flash("error","you are not the owner of current listing");
        return res.redirect(`/Waterfall/${id}`);
    }
    next();
}

