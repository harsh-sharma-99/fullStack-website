var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    seedDB = require("./seeds")

seedDB();
mongoose.connect("mongodb://localhost/yelp_camp_v3", { useNewUrlParser: true });

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");





app.get("/", function(req, res) {
    res.render("landing");
});

app.get("/campgrounds", function(req, res) {

    Campground.find({}, function(err, allcampgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds", { campground: allcampgrounds });
        }
    });
});

app.post("/campgrounds", function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = { name: name, image: image, description: desc };
    Campground.create(newCampground);

    res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(req, res) {
    res.render("new");
});

app.get("/campgrounds/:id", function(req, res) {
    var valid = mongoose.Types.ObjectId.isValid(req.params.id);
    if (valid) {
        Campground.findById(req.params.id).populate("comments").exec(function(err, foundCamp) {
            if (err) {
                console.log(err);
            } else {
                console.log(foundCamp);
                res.render("show", { camp: foundCamp });
            }
        });
    } else {
        console.log("error in name id");
    }

});


app.listen(3000, function() {
    console.log("yelpcamp is working");
});