const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("../models/data.js");
const path=require("path");
const wrapAsync=require("../Utils/wrapAsync.js");
const {serverSide}=require("../Schema.js");
const router=express.Router();
const {isloggedin,isOwner}=require("../middleware.js");
const controllerListing=require("../controller/listingController.js");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,"public")));
const {storage}=require("../clodinary.js");
const multer  = require('multer');
const upload = multer({ storage}).array('image', 10);

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(express.static('public')); 
const cors = require('cors');
app.use(cors());

const validateListing=(req,res,next)=>{
    const {error}=serverSide.validate(req.body);
    if(error){
        throw new ExpressError(400,error.message);
    }else{
        next();
    }
}

router.get("/search", wrapAsync(async (req, res) => {
    const query = req.query.query;
    console.log(query);
    if (!query) {
        req.flash("error", "Please enter a search term");
        return res.redirect("/listing");
    }

    const listings = await Listing.find({
        $or: [
            { title: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } },
            { location: { $regex: query, $options: 'i' } },
            { country: { $regex: query, $options: 'i' } }
        ]
    });

    res.render("./listings/list.ejs", { allListing: listings });
}));



// Route to create Razorpay order
router.post("/order", async (req, res) => {
    try {
        const { amount } = req.body;
        const options = {
            amount: amount * 100, // amount in paisa
            currency: 'INR',
            receipt: 'order_rcptid_11',
            payment_capture: 1,
        };
        const order = await razorpayInstance.orders.create(options);
        res.json({
            success: true,
            id: order.id,
            amount: order.amount,
            currency: order.currency,
            key_id: process.env.RAZORPAY_KEY_ID,
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ success: false, error: 'Failed to create order' });
    }
});

//index route
router.get("/",controllerListing.indexRoute);

//new route
router.get("/new",isloggedin,controllerListing.newRoute)
// router.post("/",upload.single('listing[image]'),(req,res)=>{
//     res.send(req.file);
// })
router.post("/"
,upload,wrapAsync(controllerListing.newPost)
)

router.post("/:id/rate",isloggedin,wrapAsync(async(req,res,next)=>{
    let {id}=req.params;
     const listing= await Listing.findById(id);
     listing.rating.push((req.body.rating1));
     let count=0;
    let j=0;
    for(let i in listing.rating){
        
       j=j+listing.rating[i];
       count++;
    }
    
    let rate=Math.round(j/count);
    listing.roundRate=rate;
     

    
    await listing.save();
    res.redirect(`/listing/${id}`);
}))
//show route
router.get("/:id",controllerListing.showRoute)

//update route
router.get("/:id/edit",upload,isloggedin,isOwner,controllerListing.updateRoute)
router.put("/:id",upload,wrapAsync(controllerListing.updateput))

//delete listing
router.delete("/:id",isloggedin,isOwner,controllerListing.deleteRoute);


// router.post('/:id/charge', stripeCharge, (req, res) => {
//     let {id}=req.params;
//     res.render("index.html").json({ success: true, redirectUrl: `/listing/${id}/hotels` });
//   });

module.exports=router;
