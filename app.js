const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  flash = require("connect-flash"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  methodOverride = require("method-override"),
  DogPark = require("./models/dogpark"),
  Comment = require("./models/comment"),
  User = require("./models/user"),
  seedDB = require("./seeds");

// routes
const commentRoutes = require("./routes/comments"),
  dogParkRoutes = require("./routes/dogpark"),
  authRoutes = require("./routes/index");

mongoose.connect(
  "mongodb://admin:abc123@ds141178.mlab.com:41178/heroku_rm24pkf9",
  // mongoose.connect("mongodb://localhost/yelp_camp",
  {
    useUnifiedTopology: true,
    useNewUrlParser: true
  }
);
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
// __dirname is always where it lives
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
// seedDB(); // seed the database
app.use(flash());

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
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use("/", authRoutes);
app.use("/dogparks", dogParkRoutes);
app.use("/dogparks/:id/comments", commentRoutes);

app.listen(process.env.PORT || 3000, process.env.IP, () => {
  console.log("Server has Started!");
});
