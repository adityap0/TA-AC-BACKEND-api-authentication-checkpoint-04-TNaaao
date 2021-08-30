var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var answerSchema = new Schema(
  {
    text: { type: String },
    author: { type: Schema.Types.ObjectId, ref: "User" },
    questionId: [{ type: Schema.Types.ObjectId, ref: "Question" }],
  },
  { timestamps: true }
);
module.exports = mongoose.model("Answer", answerSchema);
