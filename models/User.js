var mongoose = require("mongoose"),
  passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  firstName: String,
  lastName: String,
  email: String,
  avatar: String,
  banner: String,
  streamKey: String,
  telephone: String,
  createdAt: {
    type: Date,
    default: Date("<YYYY-mm-dd>")
  }
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
