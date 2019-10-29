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
  name: String,
  image: String
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
    if(err){
      console.log(err);
    } else {
      res.render("campgrounds", {campgrounds: allCampgrounds});
    }
  });
});

app.post("/campgrounds", (req, res) => {
  // res.send("you hit the post route");
  // get data from form and add to campgrounds array
  const name = req.body.name;
  const image = req.body.image;
  const newCampground = { name, image };
  // create a new campground and save to DB
  Campground.create(newCampground, (err, newlyCreated )=> {
    if(err) {
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

app.listen(process.env.PORT || 3000, process.env.IP, () => {
  console.log("Server has Started!");
});
