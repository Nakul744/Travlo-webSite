const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const listingUserController=require("../controllers/user.js");

// GET signup form
router.get("/signup",listingUserController.userSignup);

// POST signup form
router.post("/signup", wrapAsync(listingUserController.userPostSignup));

// GET login form
router.get("/login", listingUserController.getLogin);

// POST login form
router.post(
    "/login",
    saveRedirectUrl,
    passport.authenticate("local", {
        failureFlash: true,
        failureRedirect: "/login"
    }),
    listingUserController.postlogin
);

// Logout route
router.get("/logout", listingUserController.logoutRoute);

module.exports = router;
