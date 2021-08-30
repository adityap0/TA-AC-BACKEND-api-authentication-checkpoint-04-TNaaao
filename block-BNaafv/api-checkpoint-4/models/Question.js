var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var questionSchema = new Schema(
  {
    tags: [{ type: String }],
    title: { type: String },
    description: { type: String },
    author: { type: Schema.Types.ObjectId, ref: "User" },
    slug: { type: String },
    answers: [{ type: Schema.Types.ObjectId, ref: "Answer" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", questionSchema);
