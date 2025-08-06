const mongoose = require("mongoose");
const review = require("./review");
const { required } = require("joi");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    image: {
        url: String,
        filename: String
    },
    price: {
        type: Number
    },
    location: {
        type: String
    },
    country: {
        type: String
    },
    review: [{
        type: Schema.Types.ObjectId,
        ref: "review"
    }],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "user",
    }
    ,
    geometry:{
      type: {
         type: String,
         enum: ['Point'],
         required: false
    },
    coordinates: {
        type: [Number],
        required: false
    }
    }
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await review.deleteMany({ _id: listing.review });
    }
});

const listing = mongoose.model("listing", listingSchema);
module.exports = listing;