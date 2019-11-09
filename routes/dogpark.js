// express router insetad of app
const express = require("express");
const router = express.Router();
const DogPark = require("../models/dogpark");
const middleware = require("../middleware");

// INDEX - dog parks
// router.get("/", middleware.isLoggedIn, (req, res) => {
router.get("/", (req, res) => {
  // get all dog parks from DB
  DogPark.find({}, (err, allDogParks) => {
    if (err) {
      console.log(err);
    } else {
      res.render("dogparks/index", { dogParks: allDogParks });
    }
  });
});

router.post("/", (req, res) => {
  // res.send("you hit the post route");
  // get data from form and add to dog parks array
  const name = req.body.name,
    image = req.body.image,
    desc = req.body.description,
    price = req.body.price,
    author = {
      id: req.user._id,
      username: req.user.username
    },
    newDogPark = { name, image, description: desc, author, price };
  // console.log(req.user);

  // create a new dog park and save to DB
  DogPark.create(newDogPark, (err, newlyCreated) => {
    if (err) {
      console.log(err);
    } else {
      // redirect back to campgorunds page
      // console.log(newlyCreated);
      res.redirect("/dogparks");
    }
  });
});

router.get("/new", middleware.isLoggedIn, (req, res) => {
  res.render("dogparks/new");
});

// be sure to declare this after ^ otherwise dog parks/new won't work properly
// shows more info about specific dog park
router.get("/:id", (req, res) => {
  // find dog park with provided ID
  DogPark.findById(req.params.id)
    .populate("comments")
    .exec((err, foundDogPark) => {
      if (err || !foundDogPark) {
        req.flash("error", "Dog Park not found");
        res.redirect("back");
      } else {
        console.log(foundDogPark);
        // render show template w/ that specific Dog Park
        res.render("dogparks/show", {
          dogPark: foundDogPark,
          currentUser: req.user
        });
      }
    });
});

// EDIT DOG PARK ROUTE
router.get("/:id/edit", (req, res) => {
  DogPark.findById(req.params.id, (err, foundDogPark) => {
    if (err) {
      res.redirect("/dogparks");
    }
    res.render("dogparks/edit", {
      DogPark_id: req.params.id,
      DogPark: foundDogPark
    });
    // otherwise, redirect
    // if not, redirect
  });
});

// UPDATE DOG PARK ROUTE
router.put("/:id", middleware.checkDogParkOwnership, (req, res) => {
// router.put("/:id", (req, res) => {
  // find and update the correct dog park
  DogPark.findByIdAndUpdate(
    req.params.id,
    req.body.DogPark,
    { new: true },
    (err, updatedDogPark) => {
      if (err) {
        res.redirect("/dogparks");
      } else {
        // redirect somewhere(show page)
        res.redirect("/dogparks/" + req.params.id);
      }
    }
  );
});

// DESTROY ROUTE
router.delete("/:id", middleware.checkDogParkOwnership, (req, res) => {
  // find and delete
  DogPark.findByIdAndRemove(req.params.id, err => {
    if (err) {
      res.redirect("/dogparks");
    } else {
      res.redirect("/dogparks");
    }
  });
});

module.exports = router;
