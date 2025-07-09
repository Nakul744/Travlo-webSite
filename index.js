if(process.env.NODE_ENV!="production"){
  require('dotenv').config();
}



const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path =require("path");
const methodOverride=require("method-override");
const ejsMate =require("ejs-mate");
const session=require("express-session");
const MongoStore=require("connect-mongo")
const flash=require("connect-flash");
const passport=require("passport");
const localStrategy=require("passport-local");
const user=require("./models/user.js");


const listingsRouter=require("./routes/listing.js")
const reviewsRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");


const dbUrl=process.env.ATLASDB_URL


main() 
    .then(()=>{
     console.log("connected to DB");
    })
    .catch(()=>{
      console.log(err);
     })

async function main(){
    await mongoose.connect(dbUrl)
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")))

const store=MongoStore.create({
    mongoUrl:dbUrl,
    cryto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
});

store.on("error",()=>{
    console.log("ERROR in MONGO SESSION STORE",err);
})

const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,

   cookie: {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // ✅ Date object
    maxAge: 1000 * 60 * 60 * 24 * 7,                          // ✅ 7 days in ms
    httpOnly: true
}

}




app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(user.authenticate()));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use((req, res, next) => {
    const successMsg = req.flash("success");
    const errorMsg = req.flash("error");

    console.log("Flash Success:", successMsg); // ✅ safe to log
    res.locals.success = successMsg;
    res.locals.error = errorMsg;
    res.locals.currUser=req.user;
    next();
});



app.use("/listing",listingsRouter)
app.use("/listing/:id/review",reviewsRouter)
app.use("/",userRouter);






app.listen(8080,()=>{
    console.log("server is listening to port 8080");
})