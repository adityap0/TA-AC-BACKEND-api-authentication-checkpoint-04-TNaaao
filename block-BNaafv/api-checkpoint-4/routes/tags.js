var express = require("express");
var router = express.Router();
var Question = require("../models/Question");

/* GET home page. */
router.get("/", async function (req, res, next) {
  var allTag = [];
  try {
    var questions = await Question.find();
    questions.forEach((q) => {
      q.tags.forEach((tag) => {
        allTag.push(tag);
      });
    });
    allTag = await allTag.filter((tag, id) => {
      if (id === allTag.indexOf(tag)) {
        return tag;
      }
    });
    res.json({ allTag });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
