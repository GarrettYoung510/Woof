// refactoring middleware to this file

// dependencies
const Campground = require("../models/campground");
const Comment = require("../models/comment");

// obj to store middleware
let middlewareObj = {};

middlewareObj.checkCampgroundOwnership = (req, res, next) => {
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, (err, foundCampground) => {
      if (err || !foundCampground) {
        req.flash("error", "Campground not found");
        res.redirect("back");
      } else {
        // if user logged in, does user own the campground?
        // console.log(campground.author.id);
        // console.log(req.user._id);
        if (foundCampground.author.id.equals(req.user._id)) {
          // moves onto next part of code
          next();
        } else {
          req.flash("error", "You don't have permission to do that");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "Please Login or Sign Up");  
    res.redirect("back");
  }
};

middlewareObj.checkCommentOwnership = (req, res, next) => {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err || !foundComment) {
        req.flash("error", "Comment not found");
        res.redirect("back");
      } else {
        // if user logged in, does user own the comment?
        // cannot use === because mongoose sends over an object to compare
        if (foundComment.author.id.equals(req.user._id)) {
          // moves onto next part of code
          next();
        } else {
          req.flash("error", "You don't have permission to do that");  
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "Please Login or Sign Up");
    res.redirect("back");
  }
};

middlewareObj.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "Please Login or Sign Up");
  res.redirect("/login");
};

module.exports = middlewareObj;
