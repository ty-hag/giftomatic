var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    WishlistItemDB = require('./models/wishlistItem'),
    bodyParser = require("body-parser"),
    seedDB = require('./seed');

mongoose.connect("mongodb://localhost/giftOMatic");
seedDB();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));

app.get('/', function(req, res){
    res.render("landing");
});

// ITEM - INDEX
app.get('/items', function(req, res){
    WishlistItemDB.find({}, function(err, allWishlistItems){
        if(err){
            res.send("error");
            console.log(err);
        } else {
            res.render("items", {wishlistItems:allWishlistItems});
        }
    });
});

// ITEM - CREATE
app.post('/items', function(req, res){
    let newItem = req.body.wishlistItem;
    WishlistItemDB.create(newItem, function(err, newlyCreatedItem){
        if(err){
            console.log(err);
        } else {
            res.redirect("/items");
        }
    });
});

// ITEM - NEW
app.get('/items/new', function(req, res){
    res.render("new");
});

// ITEM - SHOW
app.get('/items/:id', function(req, res){
    console.log("item show route hit");
    WishlistItemDB.findById(req.params.id).exec(function(err, foundItem){
        if(err){
            console.log(err);
        } else {
            //res.render('/item/' + req.params.id, {item:foundItem});
            res.render('show', {item:foundItem});
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Gift-o-matic online!");
});