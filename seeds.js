const mongoose = require("mongoose");
const Campground = require("./models/campground");
const Comment = require("./models/comment");

const data = [
  {
    name: "Cloud's Rest",
    image:
      "https://www.nps.gov/mora/planyourvisit/images/OhanaCampground2016_CMeleedy_01_web.jpeg?maxwidth=1200&maxheight=1200&autorotate=false",
    description:
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis quaerat omnis similique cumque. Tempora repudiandae nesciunt voluptas recusandae eaque fuga et modi vero. Consequatur, dolorem? Maiores doloribus ut eveniet beatae."
  },
  {
    name: "Desert Mesa Rest",
    image: "https://live.staticflickr.com/4567/37514240304_1a744f1fce_z.jpg",
    description:
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis quaerat omnis similique cumque. Tempora repudiandae nesciunt voluptas recusandae eaque fuga et modi vero. Consequatur, dolorem? Maiores doloribus ut eveniet beatae."
  },
  {
    name: "Canyon's floor",
    image:
      "https://cdn2.howtostartanllc.com/images/business-ideas/business-idea-images/Campground.jpg",
    description:
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis quaerat omnis similique cumque. Tempora repudiandae nesciunt voluptas recusandae eaque fuga et modi vero. Consequatur, dolorem? Maiores doloribus ut eveniet beatae."
  }
];

const seedDB = () => {
  // remove all campgrounds
  Campground.deleteMany({}, err => {
    if (err) {
      console.log(err);
    }
    console.log("removed campgrounds!");

    // //   add a few campgrounds
    // data.forEach(seed => {
    //   Campground.create(seed, (err, campground) => {
    //     if (err) {
    //       console.log(err);
    //     } else {
    //       console.log("added a campground");
    //       // add a few comments
    //       Comment.create(
    //         {
    //           text: "This place is great, but I wish there was internet",
    //           author: "Homer"
    //         },
    //         (err, comment) => {
    //           if (err) {
    //             console.log(err);
    //           } else {
    //             campground.comments.push(comment);
    //             campground.save();
    //             console.log("created new comment");
    //           }
    //         }
    //       );
    //     }
    //   });
    // });
  });
};

module.exports = seedDB;
