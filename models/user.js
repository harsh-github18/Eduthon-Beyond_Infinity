var mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");


var UserSchema = new mongoose.Schema({
    username: String,  //email
    pusername: Boolean,
    password: String,
    name: String,
    image: { type: String, default: "images/default-user.jpg" },
    bio: String,
    skills: [
        {
            name: String
        }
    ],
    isMentor: String,
    college: String,
    gender: String,
    pgender: Boolean,
    currentStatus: String,
    phoneno: Number,
    pphoneno: Boolean,
    linkedin: String,
    location: String,
    plocation: Boolean,
    //company
    companyname: String,
    jobprofile: String,
    companyloc: String,
    //further studies
    collegename: String,
    course: String,
    year: String,
    //startup
    startupname: String,
    website: String,
    //other
    otherdetail: String
});


UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", UserSchema);