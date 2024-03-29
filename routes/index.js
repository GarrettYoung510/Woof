// express router insetad of app
const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");

// root route
router.get("/", (req, res) => {
  res.render("landing");
});

// =================
// AUTH ROUTES
// =================

// show register form
router.get("/register", (req, res) => {
  res.render("register");
});

// handle sign up logic
router.post("/register", (req, res) => {
  const newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      req.flash("error", err.message);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, () => {
      req.flash("success", "Welcome to Woof" + user.username);
      res.redirect("/dogparks");
    });
  });
});

// show login form
router.get("/login", (req, res) => {
  res.render("login");
});

// handling login logic
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dogparks",
    failureRedirect: "/login"
  }),
  (req, res) => {}
);

// logout logic
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "Logged you out!");
  res.redirect("/dogparks");
});

module.exports = router;
