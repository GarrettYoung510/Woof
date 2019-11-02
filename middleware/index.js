// refactoring middleware to this file

// dependencies
const Campground = require("../models/campground");
const Comment = require("../models/comment");

// obj to store middleware
let middlewareObj = {};

middlewareObj.checkCampgroundOwnership = (req, res, next) => {
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, (err, foundCampground) => {
      if (err) {
        res.redirect("back");
      } else {
        // if user logged in, does user own the campground?
        // console.log(campground.author.id);
        // console.log(req.user._id);
        if (foundCampground.author.id.equals(req.user._id)) {
          // moves onto next part of code
          next();
        } else {
          res.redirect("back");
        }
      }
    });
  } else {
    res.redirect("back");
  }
};

middlewareObj.checkCommentOwnership = (req, res, next) => {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err) {
        res.redirect("back");
      } else {
        // if user logged in, does user own the comment?
        // cannot use === because mongoose sends over an object to compare
        if (foundComment.author.id.equals(req.user._id)) {
          // moves onto next part of code
          next();
        } else {
          res.redirect("back");
        }
      }
    });
  } else {
    res.redirect("back");
  }
};

middlewareObj.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "Please Login First!");
  res.redirect("/login");
};

module.exports = middlewareObj;
