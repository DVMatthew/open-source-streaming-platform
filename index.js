var express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  passport = require("passport"),
  flash = require("connect-flash"),
  LocalStrategy = require("passport-local"),
  methodOverrdie = require("method-override");

var User = require("./models/user");

var index = require("./routes/index");

var url = "mongodb://localhost/open-source-streaming-platform";
mongoose.connect(url, {
  useNewUrlParser: true
});

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverrdie("_method"));
app.use(flash());
app.locals.moment = require("moment");

app.use(
  require("express-session")({
    secret: "on jah",
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use("/", index);

// Start App Listener
app.listen(3000, "localhost", function() {
  console.log(
    "\x1b[33m%s\x1b[0m",
    "Open Source Streaming Platform Has Been Started..."
  );
});
