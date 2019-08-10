var express = require("express"),
  http = require("http"),
  app = express(),
  server = http.createServer(app),
  io = require("socket.io").listen(server),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  passport = require("passport"),
  flash = require("connect-flash"),
  LocalStrategy = require("passport-local"),
  methodOverride = require("method-override");

let users = [];

var User = require("./models/user");

var index = require("./routes/index");
var user = require("./routes/userRoute");

var url = "mongodb://localhost/open-source-streaming-platform";
mongoose.connect(url, {
  useNewUrlParser: true
});

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

// Socket.io Connection Handling
io.on("connection", socket => {
  console.log("User connected..");
  socket.on("disconnect", function() {
    console.log("User disconnected..");
  });
  socket.on("chat message", function(msg) {
    console.log("message: " + msg);
    io.sockets.emit("chat message", { msg: msg, user: socket.username });
  });
  socket.on("set user", (data, callback) => {
    callback(true);
    socket.username = data;
    users.push(socket.username);
    updateUsers();
  });
  function updateUsers() {
    io.sockets.emit("users", users);
  }
});

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
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
app.use("/user", user);

// Start App Listener
server.listen(5080, "localhost", function() {
  console.log(
    "\x1b[33m%s\x1b[0m",
    "Open Source Streaming Platform Has Been Started..."
  );
});
// app.listen(3000, "localhost", function() {
//   console.log(
//     "\x1b[33m%s\x1b[0m",
//     "Open Source Streaming Platform Has Been Started..."
//   );
// });
