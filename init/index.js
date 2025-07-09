const mongoose = require("mongoose");
const listing = require("../models/listing.js");
const initdata = require("./data.js");
const User = require("../models/user.js");

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const initdb = async () => {
  await listing.deleteMany({});

  initdata.data = initdata.data.map((obj, index) => ({
    ...obj,
    owner: "6868e865fd72459578104ac1",
    latitude: obj.latitude || (20 + Math.random() * 10), // fallback to random lat
    longitude: obj.longitude || (70 + Math.random() * 10) // fallback to random lng
  }));

  await listing.insertMany(initdata.data);
  console.log("data was initialized");
};


initdb();
