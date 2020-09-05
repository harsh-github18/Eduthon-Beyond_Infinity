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
    Comment = require("./models/comment"),
    middleware = require("./middleware"),
    multer = require("multer"),
    path = require('path'),
    _ = require("lodash");

var indexRoutes = require("./routes/index");

mongoose.connect("mongodb+srv://himanipopli:mujhenhipta@cluster0-taszv.mongodb.net/Eduthon?retryWrites=true", { useNewUrlParser: true, useCreateIndex: true });

mongoose.set('useFindAndModify', false);
const Schema = mongoose.Schema;

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// Set The Storage Engine
const storage = multer.diskStorage({
    destination: './public/images/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Init Upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('image');

// Check File Type
function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

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
    User.find({}, function (err, user) {
        res.render("mentor", { user: user });
    });
});

//LEARNING CIRCLES
app.get("/circles", function (req, res) {
    res.render("learningcircle");
});

//=============================
//     POST ROUTES
//=============================

app.get("/post", function (req, res) {
    Post.find({}, function (err, foundposts) {
        if (!err) {
            res.render("home-post", { posts: foundposts });
        }
    })
});

app.get("/compose", middleware.isLoggedIn, function (req, res) {
    res.render("compose");
});

app.post("/compose", middleware.isLoggedIn, function (req, res) {
    upload(req, res, (error) => {
        if (error) {
            console.log(error);
            res.redirect('/post');
        } else {
            console.log(req.file);
            var fullPath = "images/default-post.jpg";
            if (req.file != undefined) {
                fullPath = "images/" + req.file.filename;
            }
            console.log(fullPath);
            var newpost = new Post({
                title: req.body.postTitle,
                postcontent: req.body.postBody,
                type: req.body.type,
                image: fullPath
            });
            Post.create(newpost, function (err, post) {
                if (err) {
                    console.log(err);
                } else {
                    post.author.id = req.user._id;
                    post.author.username = req.user.name;
                    post.save();
                    res.redirect("/post");
                }
            });
        }
    });

});

app.get("/post/:id", function (req, res) {

    Post.findById(req.params.id).populate("comments").exec(function (err, post) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("post", { post: post });
        }
    });

});


app.post("/post/:id", middleware.isLoggedIn, function (req, res) {
    Post.findById(req.params.id, function (err, post) {
        if (err) {
            console.log(err);
        } else {
            var newcomment = new Comment({
                text: req.body.text
            });
            Comment.create(newcomment, function (err, comment) {
                if (err) {
                    console.log(err);
                } else {

                    comment.author.id = req.user._id;
                    comment.author.username = req.user.name;
                    comment.save();
                    post.comments.push(comment);
                    post.save();
                    res.redirect("/post/" + req.params.id);
                }
            })
        }
    });

});

app.get("/post/:id/edit", middleware.checkUserPost, function (req, res) {
    Post.findById(req.params.id, function (err, foundPost) {
        if (err) {
            console.log(err);
        } else {
            res.render("edit-post", { post: foundPost });
        }
    });
});

app.put("/post/:id", middleware.checkUserPost, function (req, res) {
    upload(req, res, (error) => {
        if (error) {
            console.log(error);
            res.redirect('/post');
        } else {
            var fullPath = "images/default-post.jpg";
            if (req.file != undefined) {
                fullPath = "images/" + req.file.filename;
            }
            console.log(fullPath);
            var newPost = {
                title: req.body.postTitle,
                postcontent: req.body.postBody,
                type: req.body.type,
                image: fullPath
            };
            console.log("okayy");
            Post.findByIdAndUpdate(req.params.id, { $set: newPost }, function (err, updatedPost) {
                if (err) {
                    console.log(err);
                    res.redirect("back");
                } else {
                    console.log("Done");
                    res.redirect("/post/" + updatedPost._id);
                }
            });
        }
    });

});

app.delete("/post/:id", middleware.checkUserPost, function (req, res) {
    Post.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/post");
        }
    });
});

app.delete("/post/:post_id/:id", middleware.checkUserComment, function (req, res) {
    Comment.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/post/" + req.params.post_id);
        }
    });
});



//=============================
//     PROFILE ROUTES
//=============================

app.get("/profile/:username", middleware.isLoggedIn, function (req, res) {
    User.find({ username: req.params.username }, function (err, founduser) {
        if (err) {
            console.log(err);
        } else {
            Post.find({}, function (err, posts) {
                if (err) {
                    console.log(err);
                } else {
                    res.render("profile", { user: founduser[0], posts: posts });
                }

            });
        }

    });
});

app.get("/profile/:id/edit", middleware.checkUserProfile, function (req, res) {
    User.findById(req.params.id, function (err, user) {
        if (err) {
            console.log(err);
        } else {
            res.render("profile-edit", { user: user });
        }
    });
});


app.put("/profile/:id", middleware.checkUserProfile, function (req, res) {
    upload(req, res, (error) => {
        if (error) {
            console.log(error);
            res.redirect('/');
        } else {
            var fullPath = "images/default-user.jpg";
            if (req.file != undefined) {
                fullPath = "images/" + req.file.filename;
            }
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
            var newData = {
                name: req.body.name,
                college: req.body.college,
                skills: skills,
                isMentor: req.body.mentor,
                gender: req.body.gender,
                currentStatus: req.body.currentStatus,
                phoneno: req.body.phoneno,
                location: req.body.location,
                companyname: req.body.companyname,
                jobprofile: req.body.jobprofile,
                companyloc: req.body.companyloc,
                collegename: req.body.collegename,
                course: req.body.course,
                year: req.body.year,
                startupname: req.body.startupname,
                website: req.body.website,
                otherdetail: req.body.otherdetail,
                linkedin: req.body.linkedin,
                image: fullPath,
                bio: req.body.bio,
                pusername: req.body.pusername == "on" ? "false" : "true",
                pphoneno: req.body.pphoneno == "on" ? "false" : "true",
                pgender: req.body.pgender == "on" ? "false" : "true",
                location: req.body.location == "on" ? "false" : "true",

            };
            User.findByIdAndUpdate(req.params.id, { $set: newData }, function (err, updatedData) {
                if (err) {
                    console.log(err);
                    res.redirect("back");
                } else {
                    console.log("Done");
                    res.redirect("/profile/" + updatedData.username);
                }
            });
        }
    });

});


function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

app.listen(3000, process.env.IP, function () {
    console.log("server started ");
});
