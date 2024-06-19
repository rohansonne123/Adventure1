const express=require("express");
const router=express.Router();
const User=require("../models/userData.js");
const wrapAsync = require("../Utils/wrapAsync.js");
const passport=require("passport");
const {urlredirect}=require("../middleware.js");
const userController=require("../controller/userController.js");

router.get("/signUp",userController.signUpGet)


router.post("/signUp",wrapAsync(userController.signUpPost));

router.get("/login",userController.loginGet)


router.post("/login",urlredirect,passport.authenticate('local', { failureRedirect: '/login',failureFlash:true ,}),wrapAsync(userController.loginPost));

router.get("/logout",userController.logout)

module.exports=router;