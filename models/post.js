var mongoose = require("mongoose");

var PostSchema = new mongoose.Schema({
    title: String,
    type: String,
    image: { type: String },
    postcontent: String,
    created: { type: Date, default: Date.now },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

module.exports = new mongoose.model("Post", PostSchema);
