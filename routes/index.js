var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

//register routes
router.get("/register", function (req, res) {
    res.render("authentication/register");
});


router.post("/register", function (req, res) {
    var skills = [];
    if (req.body.webd) {
        var skill = {
            name: req.body.webd
        };
        skills.push(skill);
    }
    if (req.body.android) {
        var skill = {
            name: req.body.android
        };
        skills.push(skill);
    }
    if (req.body.ios) {
        var skill = {
            name: req.body.ios
        };
        skills.push(skill);
    }
    if (req.body.ar) {
        var skill = {
            name: req.body.ar
        };
        skills.push(skill);
    }
    if (req.body.ml) {
        var skill = {
            name: req.body.ml
        };
        skills.push(skill);
    }
    if (req.body.ai) {
        var skill = {
            name: req.body.ai
        };
        skills.push(skill);
    }
    if (req.body.ui) {
        var skill = {
            name: req.body.ui
        };
        skills.push(skill);
    }
    if (req.body.cp) {
        var skill = {
            name: req.body.cp
        };
        skills.push(skill);
    }
    var newUser = new User({
        username: req.body.username,
        password: req.body.password,
        name: req.body.name,
        skills: skills,
        isMentor: req.body.mentor
    });

    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
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
