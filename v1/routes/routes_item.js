var express = require('express');
var User = require('../models/user');
var Wishlist = require('../models/wishlist');
var WishlistItem = require('../models/wishlistItem');
var Comment = require('../models/comment');

var router = express.Router({mergeParams:true});

// ITEM - CREATE
router.post('/', isLoggedIn, function(req, res){
    let newItem = req.body.wishlistItem;
    WishlistItem.create(newItem, function(err, newlyCreatedItem){
        if(err){
            console.log(err);
        } else {
            Wishlist.findById(req.params.list_id, function(err, foundList){
                if(err){
                    console.log(err);
                } else {
                    foundList.items.push(newlyCreatedItem);
                    foundList.save();
                    res.json(newlyCreatedItem);
                }
            });
        }
    });
});

// ITEM - SHOW
router.get('/:item_id', function(req, res){

    WishlistItem.findById(req.params.item_id).populate("comments").exec(function(err, foundItem){
        if(err){
            console.log(err);
            res.redirect('/');
        } else {
            User.findById(req.params.user_id).populate('myLists').exec(function(err, foundUser){
                if(err){
                    console.log(err)
                    res.redirect('/');
                } else {
                    Wishlist.findById(req.params.list_id, function(err, foundList){
                        if(err){
                            console.log(err);
                            res.redirect('/');
                        } else {
                            res.render('show', {item:foundItem, user:foundUser, list: foundList});
                        }
                    })
                }
            })
            
        }
    });
});

// ITEM - UPDATE

// ITEM - DELETE !@! Need to update route in ejs file
router.delete('/:item_id', function(req, res){
    // First find the item you want to delete
    WishlistItem.findById(req.params.item_id, function(err, foundItem){
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
        
    WishlistItem.findByIdAndRemove(req.params.item_id, function(err, item){
        if(err){
            console.log(err);
        } else {
            console.log(`'${item.name}' deleted.`);
            res.redirect(`/user/${req.params.user_id}/lists/${req.params.list_id}`);
        }
    });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

function isCurrentUser(req, res, next){
    if(req.user === req.params.id){
        return next();
    }
    res.send("You do not have permission to access that thing!");
}

module.exports = router;