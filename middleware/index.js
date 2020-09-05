var Post = require("../models/post");
var Comment = require("../models/comment");

module.exports = {
    isLoggedIn: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash("error", "You must be signed in to do that!");
        res.redirect("/login");
    },
    checkUserPost: function (req, res, next) {
        if (req.isAuthenticated()) {
            Post.findById(req.params.id, function (err, post) {
                if (err) {
                    console.log(err);
                }
                if (post.author.id.equals(req.user._id)) {
                    next();
                } else {
                    console.log("Not Allowed!!!");
                    res.redirect("/post");
                }
            });
        } else {
            res.redirect("/login");
        }
    },
    checkUserComment: function (req, res, next) {
        if (req.isAuthenticated()) {
            Comment.findById(req.params.id, function (err, comment) {
                if (err) {
                    res.redirect("/");
                }
                if (comment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("/post/" + req.params.postid);
                }
            });
        } else {
            res.redirect("/login");
        }
    }
}