const User = require("../models/user.js");



module.exports.userSignup= (req, res) => {
    res.render("users/signup.ejs");
}

module.exports.userPostSignup=async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password); // from passport-local-mongoose

        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash("success", "Welcome to Wanderland!");
            res.redirect("/listing");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}

module.exports.getLogin=(req, res) => {
    res.render("users/login.ejs");
}

module.exports.postlogin=async (req, res) => {
        req.flash("success", "Welcome back to Wanderland! You are logged in!");
        res.redirect(res.locals.redirectUrl || "/listing");
}


module.exports.logoutRoute=(req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.flash("success", "You are logged out!");
        res.redirect("/listing");
    });
}