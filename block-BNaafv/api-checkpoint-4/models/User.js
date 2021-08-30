var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bcrypt = require("bcrypt");
var mongoose = require("mongoose");
var jwt = require("jsonwebtoken");

var userSchema = new Schema(
  {
    name: { type: String },
    username: { type: String },
    email: { type: String },
    password: { type: String },
    token: { type: String },
    bio: { type: String },
    image: { type: String },
  },
  { timestamps: true }
);

//Saving encrypted password

userSchema.pre("save", async function (next) {
  try {
    if (this.password && this.isModified("password")) {
      this.password = await bcrypt.hash(this.password, 12);
      next();
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
});
//Checking password
userSchema.methods.verifyPassword = async function (password) {
  try {
    var result = await bcrypt.compare(password, this.password);
    return result;
  } catch (error) {
    return next(error);
  }
};
//user JSON
userSchema.methods.userJSON = async function (token) {
  return {
    token: token,
    email: this.email,
    username: this.username,
  };
};
//profile
userSchema.methods.profile = async function () {
  return {
    name: this.name,
    username: this.username,
    image: this.image,
    bio: this.bio,
  };
};
//sign Token
userSchema.methods.signToken = async function () {
  var payload = { userId: this.id, email: this.email };
  try {
    var token = jwt.sign(payload, "communityform");
    return token;
  } catch (error) {
    return error;
  }
};
module.exports = mongoose.model("User", userSchema);
