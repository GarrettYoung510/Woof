const express = require('express');
const app = express();

app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("landing");
});

app.get("/campgrounds", (req, res) => {
    const campgrounds = [
        {name: "Salmon Creek", image: "http://lorempixel.com/400/200/"},
        {name: "Granite Hill", image: "http://lorempixel.com/400/200/"},
        {name: "Mountain Goat's Rest", image: "http://lorempixel.com/400/200/"}
    ]

    res.render("campgrounds", {campgrounds});
});

app.listen(process.env.PORT || 3000, process.env.IP, () => {
    console.log('Server has Started!')
})