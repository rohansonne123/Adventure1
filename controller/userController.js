const User=require("../models/userData.js");

module.exports.signUpGet=(req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.signUpPost=async(req,res)=>{
    try{
        let {email,username,password}=req.body;
        const userData=new User({email,username});
        const registeredUser=await User.register(userData,password);
        req.login(registeredUser,(err)=>{
            if(err){
               return next(err);
            }
            req.flash("success","login successfully welcome to wonderlust");
            res.redirect("/listing");
        })
        console.log(registeredUser);
        
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signUp");
    }
        
    
}

module.exports.loginGet=(req,res)=>{
    res.render("users/login.ejs");
}

module.exports.loginPost=async(req,res)=>{
    req.flash("success","Login successfully Welcome back to wanderlust");
     let redirectPath= res.locals.urlpath || "/";
    res.redirect(redirectPath); 
}

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are successfully logOut");
        res.redirect("/");
    })
}