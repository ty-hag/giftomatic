var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    WishlistItem = require('./models/wishlistItem'),
    Comment = require('./models/comment'),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    seedDB = require('./seed_plusList');

mongoose.connect("mongodb://localhost/giftOMatic");
seedDB();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(express.static("public"));

app.get('/', function(req, res){
    res.render("landing");
});

// --------------- LANDING PAGE ---------------

app.get('/', function(req, res){
    res.render('landing');
})

// --------------- ITEM ROUTES ---------------

// ITEM - INDEX
app.get('/items', function(req, res){
    WishlistItem.find({}, function(err, allWishlistItems){
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
    WishlistItem.create(newItem, function(err, newlyCreatedItem){
        if(err){
            console.log(err);
        } else {
            res.json(newlyCreatedItem);
        }
    });
});

// ITEM - NEW
app.get('/items/new', function(req, res){
    res.render("new");
});

// ITEM - SHOW
app.get('/items/:id', function(req, res){
    WishlistItem.findById(req.params.id).populate("comments").exec(function(err, foundItem){
        if(err){
            console.log(err);
        } else {
            res.render('show', {item:foundItem});
        }
    });
});

// ITEM - UPDATE

// ITEM - DELETE
app.delete('/items/:id', function(req, res){
    // First find the item you want to delete
    WishlistItem.findById(req.params.id, function(err, foundItem){
        if(err){
            console.log(err);
        } else if (foundItem.comments){
            foundItem.comments.forEach(function(comment){
                Comment.findByIdAndRemove(comment._id, function(err){
                    if(err){
                        console.log(err);
                    } 
                });
            });
        }
    });
        
    WishlistItem.findByIdAndRemove(req.params.id, function(err, item){
        if(err){
            console.log(err);
        } else {
            console.log(`'${item.name}' deleted.`);
            res.redirect('/items');
        }
    });
});
    

    
    // WishlistItem.findByIdAndRemove(req.params.id, function(err){
    //     if(err){
    //         res.redirect('/items'); //!@! This needs an error message or something
    //     } else {
    //         res.redirect('/items');
    //     }
    // });

// --------------- COMMENT ROUTES ---------------

// COMMENT - NEW
app.get('/items/:id/comments/new', function(req, res){
    WishlistItem.findById(req.params.id, function(err, foundItem){
        if(err){
            console.log(err);
            res.redirect('/items');
        } else {
            res.render('newComment', {item: foundItem});
        }
    });
});

// COMMENT - CREATE
app.post('/items/:id/comments', function(req, res){
    
    Comment.create(req.body.comment, function(err, newComment){
        if(err){
            console.log(err);
        } else {
            WishlistItem.findById(req.params.id, function(err, itemToUpdate){
                if(err){
                    console.log(err);
                }else{
                    itemToUpdate.comments.push(newComment);
                    itemToUpdate.save();
                    res.json(newComment);
                    console.log(`Comment added to '${itemToUpdate.name}'.`);
                }
            });
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Gift-o-matic online!");
});