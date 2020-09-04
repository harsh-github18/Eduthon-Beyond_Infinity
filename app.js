var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    flash = require("connect-flash"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Post = require("./models/post"),
    User = require("./models/user"),
    Comment = require("./models/comment");

var indexRoutes = require("./routes/index");

mongoose.connect("mongodb+srv://himanipopli:mujhenhipta@cluster0-taszv.mongodb.net/Eduthon?retryWrites=true", { useNewUrlParser: true, useCreateIndex: true });

mongoose.set('useFindAndModify', false);
const Schema = mongoose.Schema;

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());


// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "we can do this!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

//HOME PAGE
app.get("/", function (req, res) {
    res.render("home");
});

app.use("/", indexRoutes);

//MENTOR PAGE
app.get("/mentor", function (req, res) {
    res.render("mentor");
});

//LEARNING CIRCLES
app.get("/circles", function (req, res) {
    res.render("learningcircle");
});

//=============================
//     POST ROUTES
//=============================

app.get("/post", function (req, res) {
    res.render("home-post");
});

app.get("/compose", function (req, res) {
    res.render("compose");
});


//=============================
//     PROFILE ROUTES
//=============================

app.get("/profile", function (req, res) {
    res.render("profile");
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

app.listen(3000, process.env.IP, function () {
    console.log("server started ");
});
