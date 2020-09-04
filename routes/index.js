var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

//register routes
router.get("/register", function (req, res) {
    res.render("authentication/register");
});


router.post("/register", function (req, res) {

    var newUser = new User({
        username: req.body.username,
        password: req.body.password,
        firstname: req.body.firstname,
        lastname: req.body.lastname
    });

    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            return res.render("authentication/register", { "error": err.message });
        }
        passport.authenticate("local")(req, res, function () {
            res.redirect("/");
        });
    });

});

//login
router.get("/login", function (req, res) {
    res.render("authentication/login");
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
}), function (req, res) {
});


//logout

router.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
});


module.exports = router;
