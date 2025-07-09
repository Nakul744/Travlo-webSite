const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const ExpressError = require("../utils/ExpressError.js");




module.exports.postReview=async (req, res, next) => {
    const { id } = req.params;
    console.log("Received review for listing ID:", id);  // ✅ Debug

    const foundListing = await Listing.findById(id);
    if (!foundListing) {
        return next(new ExpressError("Listing not found for adding review", 404));
    }


    const newReview = new Review(req.body.review);
    newReview.author=req.user._id;
    foundListing.review.push(newReview);

    await newReview.save();
    await foundListing.save();
    req.flash("success", "New review created successfully!"); // ✅ set flash message


    res.redirect(`/listing/${foundListing._id}`);
};


module.exports.deleteReview=async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { review: reviewId } }); // ✅ also fixed typo 'reveiw'
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted successfully!"); // ✅ set flash message

    res.redirect(`/listing/${id}`);
}