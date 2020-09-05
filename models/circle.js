var mongoose = require("mongoose");

var CircleSchema = new mongoose.Schema({
    title: String,
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message"
        }
    ]
});

module.exports = new mongoose.model("Circle", CircleSchema);