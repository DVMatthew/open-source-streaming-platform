var express = require("express"),
  router = express.Router(),
  User = require("../models/user");

router.get("/:id", (req, res) => {
  User.findById(req.params.id, (err, foundUsr) => {
    if (err) {
      req.flash("error", "Something went wrong");
      return res.redirect("/");
    }
    res.render("user/upage", {
      user: foundUsr
    });
  });
});

module.exports = router;
