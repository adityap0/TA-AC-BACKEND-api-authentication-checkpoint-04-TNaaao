var express = require("express");
var router = express.Router();
var auth = require("../middlewares/auth");
var slug = require("slug");
var Question = require("../models/Question");
var Answer = require("../models/Answer");

/* GET home page. */
router.get("/", async (req, res, next) => {
  try {
    var allQuestions = await Question.find();
    res.status(200).json({ allQuestions });
  } catch (error) {
    next(error);
  }
});
router.post(
  "/",
  auth.loggedInUser,
  auth.validateToken,
  auth.userInfo,
  async function (req, res, next) {
    req.body.tags = await req.body.tags.split(",");
    req.body.tags = await req.body.tags.map((item) => {
      return item.trim().toUpperCase();
    });
    req.body.slug = await slug(req.body.title);
    req.body.author = await req.session.userId;
    var question = await Question.create(req.body);
    var qid = await question._id;
    var qinfo = await Question.findById(qid, "tags title description").populate(
      "author",
      "username email"
    );
    res.status(200).json({ qinfo });
  }
);
router.put(
  "/:questionId",
  auth.loggedInUser,
  auth.validateToken,
  auth.userInfo,
  async (req, res, next) => {
    var qid = req.params.questionId;
    req.body.tags = req.body.tags.split(",");
    req.body.tags = req.body.tags.map((item) => {
      return item.trim().toUpperCase();
    });
    req.body.slug = slug(req.body.title);
    try {
      var question = await Question.findByIdAndUpdate(qid, req.body);
      var qinfo = await Question.findById(
        qid,
        "tags title description"
      ).populate("author", "username email");
      res.status(200).json({ qinfo, msg: "Updated Successfully" });
    } catch (error) {
      next(error);
    }
  }
);
router.delete(
  "/:slug",
  auth.loggedInUser,
  auth.validateToken,
  auth.userInfo,
  async (req, res, next) => {
    var slug = req.params.slug;
    try {
      var question = await Question.findOneAndDelete({ slug });
      res.status(200).json({ question });
    } catch (error) {
      next(error);
    }
  }
);
router.post(
  "/:questionId/answers",
  auth.loggedInUser,
  auth.validateToken,
  auth.userInfo,
  async (req, res, next) => {
    req.body.author = req.session.userId;
    req.body.questionId = req.params.questionId;
    try {
      var answer = await Answer.create(req.body);
      var ansID = await answer._id;
      var question = await Question.findByIdAndUpdate(req.body.questionId, {
        $push: { answers: ansID },
      });
      res.json({ answer });
    } catch (error) {
      next(error);
    }
  }
);
router.get(
  "/:questionId/answers",
  auth.loggedInUser,
  auth.validateToken,
  auth.userInfo,
  async (req, res, next) => {
    var qid = req.params.questionId;
    try {
      var question = await Question.findById(qid).populate({
        path: "answers",
        populate: { path: "author", select: "name username" },
      });
      var allAnswers = await question.answers;
      res.status(200).json({ allAnswers });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
