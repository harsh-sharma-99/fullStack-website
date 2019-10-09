var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose")

mongoose.connect("mongodb://localhost/yelp_camp_v1", { useNewUrlParser: true });
mongoose.Types.ObjectId.isValid('your id is here');



app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

//schema setup
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create({
//     name: "ladakh",
//     image: "https://images.unsplash.com/photo-1508873696983-2dfd5898f08b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
//     description: "this is verybeautiful place. it is lovely. i love its aroma . wonderful ambience!!!"
// }, function(err, camp) {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log(camp);
//     }
// });



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
        Campground.findById(req.params.id, function(err, foundCamp) {
            if (err) {
                console.log(err);
            } else {
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