const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn}=require("../middleware.js");
const listingReviewController=require("../controllers/review.js")

router.post("/",isLoggedIn, wrapAsync(listingReviewController.postReview));
// DELETE review
router.delete("/:reviewId",isLoggedIn, wrapAsync(listingReviewController.deleteReview));

module.exports = router;