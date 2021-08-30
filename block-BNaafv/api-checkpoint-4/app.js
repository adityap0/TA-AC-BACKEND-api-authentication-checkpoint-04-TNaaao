var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var session = require("express-session");
var MongoStore = require("connect-mongo");
var mongoose = require("mongoose");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var questionsRouter = require("./routes/questions");
var answersRouter = require("./routes/answers");
var tagsRouter = require("./routes/tags");

var app = express();

//Connecting to Db
mongoose.connect(
  "mongodb://127.0.0.1:27017/communityform",
  { useNewUrlParser: true, useUnifiedTopology: true },
  (error) => {
    console.log(error ? error : "Connected to Db");
  }
);
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//session Middleware
app.use(
  session({
    secret: "communityform",
    saveUninitialized: false,
    resave: false,
    store: MongoStore.create({
      mongoUrl: "mongodb://127.0.0.1:27017/communityform",
    }),
  })
);

app.use("/api/", indexRouter);
app.use("/api/users", usersRouter);
app.use("/api/questions", questionsRouter);
app.use("/api/answers", answersRouter);
app.use("/api/tags", tagsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
