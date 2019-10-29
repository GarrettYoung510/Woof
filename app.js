const express    = require("express"),
      app        = express(),
      bodyParser = require("body-parser"),
      mongoose   = require("mongoose");

mongoose.connect("mongodb://localhost/yelp_camp", {
  useUnifiedTopology: true,
  useNewUrlParser: true
});
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

//  schema setup
const campgroundSchema = new mongoose.Schema({
  name:        String,
  image:       String,
  description: String
});

const Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
//   {
//     name: "Salmon Creek",
//     image: "http://lorempixel.com/400/200/"
//   }, function(err, campground) {
//     if(err) {
//       console.log(err);
//     } else {
//       console.log("newly created campground: ");
//       console.log(campground);
//     }
// });

app.get("/", (req, res) => {
  res.render("landing");
});

app.get("/campgrounds", (req, res) => {
  // get all campgrounds from DB
  Campground.find({}, (err, allCampgrounds) => {
    if (err) {
      console.log(err);
    } else {
      res.render("index", { campgrounds: allCampgrounds });
    }
  });
});

app.post("/campgrounds", (req, res) => {
  // res.send("you hit the post route");
  // get data from form and add to campgrounds array
  const name        = req.body.name,
        image       = req.body.image,
        desc        = req.body.description,
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
  res.render("new.ejs");
});

// be sure to declare this after ^ otherwise campgrounds/new won't work properly
// shows more info about specific campground
app.get("/campgrounds/:id", (req, res) => {
  // find campground with provided ID
  Campground.findById(req.params.id, (err, foundCampground) => {
    if (err) {
      console.log(err);
    } else {
      // render show template w/ that specific campground
      res.render("show", { campground: foundCampground });
    }
  });
});

app.listen(process.env.PORT || 3000, process.env.IP, () => {
  console.log("Server has Started!");
});
