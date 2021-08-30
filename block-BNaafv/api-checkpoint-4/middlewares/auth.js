var User = require("../models/User");
var jwt = require("jsonwebtoken");
module.exports = {
  loggedInUser: (req, res, next) => {
    if (req.session && req.session.userId) {
      next();
    } else {
      res.json({ msg: "Please Log In" });
    }
  },
  userInfo: (req, res, next) => {
    var userId = req.session && req.session.userId;
    if (userId) {
      User.findById(userId, "username email", (error, user) => {
        if (error) return next(error);
        req.user = user;
        res.locals.user = user;
        next();
      });
    } else {
      req.user = null;
      res.locals.user = null;
    }
  },
  validateToken: async (req, res, next) => {
    try {
      var userId = await req.session.userId;
      var token = await User.findById(userId, "token");
      var tokenX = await token.token;
      if (token) {
        var payload = await jwt.verify(tokenX, "communityform");
        req.user = await payload;
        next();
      } else {
        res.status(400).json({ error: "Token Invalid /Required" });
      }
    } catch (error) {
      next(error);
    }
  },
};
