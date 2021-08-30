var express = require("express");
var router = express.Router();
var auth = require("../middlewares/auth");
const Answer = require("../models/Answer");

router.put(
  "/:answerId",
  auth.loggedInUser,
  auth.validateToken,
  async function (req, res, next) {
    var aid = req.params.answerId;
    try {
      var answer = await Answer.findByIdAndUpdate(aid, req.body);
      res.json({ answer });
    } catch (error) {
      return next(error);
    }
  }
);
router.delete(
  "/:answerId",
  auth.loggedInUser,
  auth.validateToken,
  async function (req, res, next) {
    var aid = req.params.answerId;
    try {
      var answer = await Answer.findByIdAndDelete(aid);
      res.json({ answer });
    } catch (error) {
      return next(error);
    }
  }
);

module.exports = router;
