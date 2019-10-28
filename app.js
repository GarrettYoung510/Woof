const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

const campgrounds = [
  { name: "Salmon Creek", image: "http://lorempixel.com/400/200/" },
  { name: "Granite Hill", image: "http://lorempixel.com/400/200/" },
  { name: "Mountain Goat's Rest", image: "http://lorempixel.com/400/200/" }
];

app.get("/", (req, res) => {
  res.render("landing");
});

app.get("/campgrounds", (req, res) => {
  res.render("campgrounds", { campgrounds });
});

app.post("/campgrounds", (req, res) => {
  // res.send("you hit the post route");
  // get data from form and add to campgrounds array
  const name = req.body.name;
  const image = req.body.image;
  const newCampground = { name, image };
  campgrounds.push(newCampground);
  // redirect back to campgorunds page
  res.redirect("/campgrounds");
});

app.get("/campgrounds/new", (req, res) => {
  res.render("new.ejs");
});

app.listen(process.env.PORT || 3000, process.env.IP, () => {
  console.log("Server has Started!");
});
