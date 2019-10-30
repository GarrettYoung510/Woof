const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  Campground = require("./models/campground"),
  Comment = require("./models/comment"),
  seedDB = require("./seeds");

mongoose.connect("mongodb://localhost/yelp_camp", {
  useUnifiedTopology: true,
  useNewUrlParser: true
});
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
// __dirname is always where it lives
app.use(express.static(__dirname + "/public"));
seedDB();

app.get("/", (req, res) => {
  res.render("landing");
});

app.get("/campgrounds", (req, res) => {
  // get all campgrounds from DB
  Campground.find({}, (err, allCampgrounds) => {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/index", { campgrounds: allCampgrounds });
    }
  });
});

app.post("/campgrounds", (req, res) => {
  // res.send("you hit the post route");
  // get data from form and add to campgrounds array
  const name = req.body.name,
    image = req.body.image,
    desc = req.body.description,
    newCampground = { name: name, image: image, description: desc };
  // create a new campground and save to DB
  Campground.create(newCampground, (err, newlyCreated) => {
    if (err) {
      console.log(err);
    } else {
      // redirect back to campgorunds page
      res.redirect("/campgrounds");
    }
  });
});

app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

// be sure to declare this after ^ otherwise campgrounds/new won't work properly
// shows more info about specific campground
app.get("/campgrounds/:id", (req, res) => {
  // find campground with provided ID
  Campground.findById(req.params.id)
    .populate("comments")
    .exec((err, foundCampground) => {
      if (err) {
        console.log(err);
      } else {
        console.log(foundCampground);
        // render show template w/ that specific campground
        res.render("campgrounds/show", { campground: foundCampground });
      }
    });
});

// =================
// COMMENTS ROUTES
// =================

app.get("/campgrounds/:id/comments/new", (req, res) => {
  // find campground by id
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", { campground });
    }
  });
});

app.post("/campgrounds/:id/comments", (req, res) => {
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
          campground.comments.push(comment);
          campground.save();
          res.redirect(`/campgrounds/${campground._id}`);
        }
      });
      // connect new comment to campground
      // redirect campground show page
    }
  });
});

app.listen(process.env.PORT || 3000, process.env.IP, () => {
  console.log("Server has Started!");
});
