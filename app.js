const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  Campground = require("./models/campground"),
  Comment = require("./models/comment"),
  User = require("./models/user"),
  seedDB = require("./seeds");

// routes
const commentRoutes = require("./routes/comments"),
  campgroundRoutes = require("./routes/campgrounds"),
  authRoutes = require("./routes/index");

mongoose.connect("mongodb://localhost/yelp_camp", {
  useUnifiedTopology: true,
  useNewUrlParser: true
});
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
// __dirname is always where it lives
app.use(express.static(__dirname + "/public"));
seedDB(); // seed the database

// passport configuration
app.use(
  require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.use("/", authRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT || 3000, process.env.IP, () => {
  console.log("Server has Started!");
});
