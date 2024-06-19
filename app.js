if(process.env.NODE_ENV!="production"){
    require('dotenv').config();
}
console.log(process.env) 

const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/data.js");
const funListing=require("./models/Fun.js");
const agriListing=require("./models/Agri.js");
const campingListing=require("./models/Camping.js");
const waterfallListing=require("./models/Waterfall.js");
const datalisting=require("./init/database.js");
const path=require("path");
const methodOverride = require('method-override');
const ejsMate= require('ejs-mate');
const wrapAsync=require("./Utils/wrapAsync.js");
const ExpressError=require("./Utils/ExpressError.js");
const {serverSide}=require("./Schema.js");
const {AgriserverSide}=require("./Schema.js");
const {FunserverSide}=require("./Schema.js");
const {CampingserverSide}=require("./Schema.js");
const {reviewSchema}=require("./Schema.js");
const review=require("./models/review.js");
const session=require("express-session");
const flash = require("express-flash");
const listingRouter=require("./router/listing.js");
const AgriRouter=require("./router/agriListing.js");
const FunRouter=require("./router/funListing.js");
const CampingRouter=require("./router/CampingRouter.js");
const WaterfallRouter=require("./router/WaterfallListing.js");
const reviewRouter=require("./router/review.js");
const funreviewRouter=require("./router/funreview.js");
const agrireviewRouter=require("./router/agrireview.js");
const CampingreviewRouter=require("./router/CampingReviewRouter.js");
const WaterfallreviewRouter=require("./router/WaterfallReview.js");
const HotelRouter=require("./router/HotelListing.js");
const HotelAgriRouter=require("./router/HotelAgri.js");
const FunHotelRouter=require("./router/HotelFun.js");
const RoomRouter=require("./router/RoomListing.js");
const RoomAgriRouter=require("./router/RoomAgri.js");
const FunRoomRouter=require("./router/RoomFun.js");
const userRouter=require("./router/User.js");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const mongoosePassport=require("passport-local-mongoose");
const User=require("./models/userData.js");
const cors = require('cors');
app.use(cors());
const razorpay = require('razorpay');



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
    res.locals.currPath=req.path;
    
    res.locals.currId=req.path;
    
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
app.get("/",wrapAsync(async(req,res)=>{
    let listing=await Listing.find().sort({roundRate:-1}).limit(3);
    let fun=await funListing.find().sort({roundRate:-1}).limit(3);
    let agri=await agriListing.find().sort({roundRate:-1}).limit(3);
    let waterfall=await waterfallListing.find().sort({roundRate:-1}).limit(3);
    let camping=await campingListing.find().sort({roundRate:-1}).limit(3);
    res.render("Home.ejs",{listing,fun,agri,waterfall,camping});
}));

app.use("/listing/:id",reviewRouter);
app.use("/Fun/:id",funreviewRouter);
app.use("/Agri/:id",agrireviewRouter);
app.use("/Camping/:id/campingreview",CampingreviewRouter);
app.use("/Waterfall/:id/Waterfallreview",WaterfallreviewRouter);

app.use("/listing",listingRouter);
app.use("/listing",HotelRouter);
app.use("/listing",RoomRouter);
app.use("/Agri",AgriRouter);
app.use("/Agri",HotelAgriRouter);
app.use("/Agri",RoomAgriRouter);
app.use("/Fun",FunRouter);
app.use("/Fun",FunHotelRouter);
app.use("/Fun",FunRoomRouter);
app.use("/Camping",CampingRouter);
app.use("/Waterfall",WaterfallRouter);
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