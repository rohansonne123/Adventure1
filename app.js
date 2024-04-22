if(process.env.NODE_ENV!="production"){
    require('dotenv').config();
}
console.log(process.env) 

const express=require("express");
const app=express();
const mongoose=require("mongoose");
// const data=require("./models/data.js");
// const dataAgri=require("./models/Agri.js");
// const dataFun=require("./models/Fun.js");
const datalisting=require("./init/database.js");
const path=require("path");
const methodOverride = require('method-override');
const ejsMate= require('ejs-mate');
const wrapAsync=require("./Utils/wrapAsync.js");
const ExpressError=require("./Utils/ExpressError.js");
const {serverSide}=require("./Schema.js");
const {AgriserverSide}=require("./Schema.js");
const {FunserverSide}=require("./Schema.js");
const {reviewSchema}=require("./Schema.js");
const review=require("./models/review.js");
const session=require("express-session");
const flash = require("express-flash");
const listingRouter=require("./router/listing.js");
const AgriRouter=require("./router/agriListing.js");
const FunRouter=require("./router/funListing.js");
const reviewRouter=require("./router/review.js");
const userRouter=require("./router/User.js");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const mongoosePassport=require("passport-local-mongoose");
const User=require("./models/userData.js");

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        expires:Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly:true,
     }
  }))
  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(new LocalStrategy(User.authenticate()));

  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());

  app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.userLoggedin=req.user;
    next();
  })

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")));

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}
main().then(()=>{
    console.log("connection established");
}).catch((err)=>{
    console.log(err);
});





//Home page
app.get("/",(req,res)=>{
    res.render("Home.ejs");
})

app.use("/listing/:id/review",reviewRouter);
app.use("/listing",listingRouter);
app.use("/Agri",AgriRouter);
app.use("/Fun",FunRouter);
app.use("/",userRouter);

app.all("*",(req,res,next)=>{
    //res.render("./includes/error.ejs");

    next(new ExpressError(401,"path not found"));
});
app.use((err,req,res,next)=>{
    let {statusCode=501,message="page not found"}=err;
    res.render("error.ejs",{message});
})
app.listen(8080,()=>{
    console.log("connected to port 8080");
})