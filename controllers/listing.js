const { response } = require("express");
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');

const geocodingClient=mbxGeocoding({accessToken:'pk.eyJ1IjoiaXRzc2FyYW5oZXJlIiwiYSI6ImNsd3B3aDFybjFodTMyaXJ6cGQxeWdwYzcifQ.4HPJRlRvgTdHaXXTDQEWCg'});


module.exports.index=async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { alllistings: allListings });  // ✅ fixed
}

module.exports.renderNewForm=(req, res) => {
    
    res.render("listings/new.ejs");

};

module.exports.show = async (req, res) => {
    const { id } = req.params;
    const idlisting = await Listing.findById(id)
        .populate({
            path: "review",
            populate: { path: "author" }
        })
        .populate("owner");

    if (!idlisting) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listing");
    }

    res.render("listings/show.ejs", { idlisting, mapKey: process.env.GOOGLE_MAPS_API_KEY });
};



module.exports.delete=async (req, res) => {
    const { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted successfully!"); // ✅ set flash message

    res.redirect("/listing");
}


module.exports.update = async (req, res) => {
   let { id } = req.params;

  

  let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});

  if(typeof req.file!=="undefined"){

    let url =req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
  }

  await listing.save();

  req.flash("success", "Listing updated successfully!");
  res.redirect(`/listing/${listing._id}`);
};


module.exports.edit=async (req, res) => {
    const { id } = req.params;
    const editlisting = await Listing.findById(id);
    if(!editlisting){
        req.flash("error","listing you requested fro does not exist ");
        res.redirect("/listing");
    }
    res.render("listings/edit.ejs", { editlisting });
}



module.exports.create=async (req, res) => {
   let response=await  geocodingClient
     .forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
   .send();

   

  
    let url=req.file.path
    let filename=req.file.filename
    console.log(url,filename)
    if (!req.body.listing) throw new ExpressError("Invalid Listing Data", 400);
    const newListing = new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    newListing.geometry=response.body.features[0].geometry
    let result =await newListing.save();
    console.log(result);
    req.flash("success", "New listing created successfully!"); // ✅ set flash message
    res.redirect("/listing"); // ✅ redirect after setting it
}