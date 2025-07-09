const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");

const upload = multer({ storage });

// NEW form route
router.get("/new", isLoggedIn, listingController.renderNewForm);

// INDEX route
router.get("/", wrapAsync(listingController.index));

// SHOW route
router.get("/:id", wrapAsync(listingController.show));

// DELETE route
router.delete("/:id", isLoggedIn, wrapAsync(listingController.delete));

// UPDATE route — ✅ fixed to handle file upload
router.put("/:id", isLoggedIn, upload.single("listing[image]"), wrapAsync(listingController.update));

// EDIT form route — ✅ removed file upload middleware (no file is submitted in GET)
router.get("/:id/edit", isLoggedIn, wrapAsync(listingController.edit));

// CREATE route — ✅ fixed field name
router.post("/", isLoggedIn, upload.single("listing[image]"), wrapAsync(listingController.create));

module.exports = router;
