// express router insetad of app
const express = require("express");
// merge params from dog park and comments together so we can access the :id
const router = express.Router({ mergeParams: true });
const DogPark = require("../models/dogpark");
const Comment = require("../models/comment");
const middleware = require("../middleware");

// =================
// COMMENTS ROUTES
// =================

//   comments new
router.get("/new", middleware.isLoggedIn, (req, res) => {
  // find dog park by id
  DogPark.findById(req.params.id, (err, dogPark) => {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", { dogPark });
    }
  });
});

//   comments create
router.post("/", middleware.isLoggedIn, (req, res) => {
  // lookup dog park using ID
  DogPark.findById(req.params.id, (err, dogPark) => {
    if (err) {
      console.log(err);
      res.redirect("/dogparks");
    } else {
      // create new comment
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          req.flash("error", "Something went wrong");
          console.log(err);
        } else {
          // add username and id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;

          //   console.log("new comment's username will be" + req.user.username);
          // save comment
          comment.save();
          dogPark.comments.push(comment);
          dogPark.save();
          //   console.log(comment);
          req.flash("success", "Successfully added comment");
          res.redirect(`/dogparks/${dogPark._id}`);
        }
      });
      // connect new comment to dog park
      // redirect dog park show page
    }
  });
});

// comment edit route
router.get("/:comment_id/edit", (req, res) => {
  Comment.findById(req.params.comment_id, (err, foundComment) => {
    if (err) {
      res.redirect("back");
    } else {
      res.render("comments/edit", {
        dogPark_id: req.params.id,
        comment: foundComment
      });
    }
  });
});

// comment update
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndUpdate(
    req.params.comment_id,
    req.body.comment,
    (err, updatedComment) => {
      if (err) {
        res.redirect("back");
      } else {
        res.redirect("/dogparks/" + req.params.id);
      }
    }
  );
});

// comment destroy route
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndRemove(req.params.comment_id, err => {
    if (err) {
      res.redirect("back");
    } else {
      req.flash("success", "Comment deleted");
      res.redirect("/dogparks/" + req.params.id);
    }
  });
});

module.exports = router;
