// Requires
var express = require("express"),
    router = express.Router(),
    passport = require("passport");

// Models
var User = require("../models/user");

router.get("/", function (req, res) {
    res.render("index");
});

router.get("/login", function (req, res) {
    res.render("login");
});

router.post(
    "/login",
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/"
    }),
    function (req, res) {}
);

router.get("/register", function (req, res) {
    res.render("register");
});

router.post("/register", function (req, res) {
    var newUser = new User({
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        telephone: req.body.telephone,
        email: req.body.email,
        avatar: req.body.avatar,
        banner: req.body.banner
    });

    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function () {
            req.flash("success", 'Welcome ' + user.username);
            res.redirect("/");
        });
    });

});

module.exports = router;