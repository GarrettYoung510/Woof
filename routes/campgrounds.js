// express router insetad of app
const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");

//   middleware
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

// INDEX - campgrounds
router.get("/", isLoggedIn, (req, res) => {
  // get all campgrounds from DB
  Campground.find({}, (err, allCampgrounds) => {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/index", { campgrounds: allCampgrounds });
    }
  });
});

router.post("/", (req, res) => {
  // res.send("you hit the post route");
  // get data from form and add to campgrounds array
  const name = req.body.name,
    image = req.body.image,
    desc = req.body.description,
    author = {
      id: req.user._id,
      username: req.user.username
    },
    newCampground = { name, image, description: desc, author };
  // console.log(req.user);

  // create a new campground and save to DB
  Campground.create(newCampground, (err, newlyCreated) => {
    if (err) {
      console.log(err);
    } else {
      // redirect back to campgorunds page
      // console.log(newlyCreated);
      res.redirect("/campgrounds");
    }
  });
});

router.get("/new", (req, res) => {
  res.render("campgrounds/new");
});

// be sure to declare this after ^ otherwise campgrounds/new won't work properly
// shows more info about specific campground
router.get("/:id", (req, res) => {
  // find campground with provided ID
  Campground.findById(req.params.id)
    .populate("comments")
    .exec((err, foundCampground) => {
      if (err) {
        console.log(err);
      } else {
        console.log(foundCampground);
        // render show template w/ that specific campground
        res.render("campgrounds/show", {
          campground: foundCampground,
          currentUser: req.user
        });
      }
    });
});

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", (req, res) => {
  Campground.findById(req.params.id, (err, foundCampground) => {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      res.render("campgrounds/edit", { campground: foundCampground });
    }
  });
});
// UPDATE CAMPGROUND ROUTE
router.put("/:id", (req, res) => {
  // find and update the correct campground
  Campground.findByIdAndUpdate(
    req.params.id,
    req.body.campground,
    (err, updatedCampground) => {
      if (err) {
        res.redirect("/campgrounds");
      } else {
        res.redirect("/campgrounds/" + req.params.id);
      }
    }
  );
  // redirect somewhere(show page)
});

module.exports = router;
