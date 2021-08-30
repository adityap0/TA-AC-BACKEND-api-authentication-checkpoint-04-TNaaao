var express = require("express");
var router = express.Router();
var User = require("../models/User");
var jwt = require("jsonwebtoken");
var auth = require("../middlewares/auth");
const { Router } = require("express");
/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

// Register User
router.post("/register", async (req, res, next) => {
  try {
    var user = await User.create(req.body);
    var userId = user._id;
    var token = await user.signToken();
    var updatedUser = await User.findByIdAndUpdate(userId, { token });
    var userJSON = await user.userJSON(token);
    res.json({ userJSON });
  } catch (error) {
    return next(error);
  }
});

// Login User
router.post("/login", async (req, res, next) => {
  var { email, password } = req.body;
  try {
    if (!email || !password) {
      res.json({ msg: "Email/Password required" });
    }
    var user = await User.findOne({ email });
    if (!user) {
      res.json({ msg: "User not found...Please Register yourself" });
    }
    var result = await user.verifyPassword(password);
    if (!result) {
      res.json({ msg: "Wrong Password" });
    } else {
      var userJSON = await user.userJSON();
      req.session.userId = await user._id;
      res.json({ userJSON, msg: "User Successfully logged in.." });
    }
  } catch (error) {
    next(error);
  }
});
// Current User
router.get(
  "/current-user",
  auth.loggedInUser,
  auth.validateToken,
  async (req, res, next) => {
    try {
      var userId = await req.session.userId;
      var user = await User.findById(userId);
      var userJSON = await user.userJSON();
      res.status(200).json({ userJSON });
    } catch (error) {
      next(error);
    }
  }
);
//Profile Information
router.get(
  "/profile/:username",
  auth.loggedInUser,
  auth.validateToken,
  async (req, res, next) => {
    try {
      var username = await req.params.username;
      var user = await User.findOne({ username });
      if (!user) {
        res.json({ msg: "User Not Found" });
      }
      var profile = await user.profile();
      res.json({ profile });
    } catch (error) {
      next(error);
    }
  }
);

// Update Profile
router.put(
  "/profile/:username",
  auth.loggedInUser,
  auth.validateToken,
  async (req, res, next) => {
    try {
      var username = await req.params.username;
      var user = await User.findOneAndUpdate({ username }, req.body);
      if (!user) {
        return res.json({ msg: "User Not Found" });
      }
      var userId = await user._id;
      var updatedUser = await User.findById(userId);
      var profile = await updatedUser.profile();
      res.json({ profile, msg: "Updated Successfully!" });
    } catch (error) {
      next(error);
    }
  }
);

router.get("/logout", (req, res, next) => {
  req.session.destroy();
  res.clearCookie("connect.sid");
  res.json({ msg: "Logout Success" });
});

module.exports = router;
