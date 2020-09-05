var mongoose = require("mongoose");

var MessageSchema = new mongoose.Schema({
    text: String,
    created: { type: Date, default: Date.now },
    author: {
        id: {

            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

module.exports = new mongoose.model("Message", MessageSchema);