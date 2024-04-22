
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