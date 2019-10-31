// express router insetad of app
const express = require("express");
// merge params from campground and comments together so we can access the :id
const router = express.Router({ mergeParams: true });
const Campground = require("../models/campground");
const Comment = require("../models/comment");

// middleware
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

// =================
// COMMENTS ROUTES
// =================

//   comments new
router.get("/new", isLoggedIn, (req, res) => {
  // find campground by id
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", { campground });
    }
  });
});

//   comments create
router.post("/", isLoggedIn, (req, res) => {
  // lookup campground using ID
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      // create new comment
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          console.log(err);
        } else {
          // add username and id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;

          //   console.log("new comment's username will be" + req.user.username);
          // save comment
          comment.save();
          campground.comments.push(comment);
          campground.save();
        //   console.log(comment);
          res.redirect(`/campgrounds/${campground._id}`);
        }
      });
      // connect new comment to campground
      // redirect campground show page
    }
  });
});

module.exports = router;
