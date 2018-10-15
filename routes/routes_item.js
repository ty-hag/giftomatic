var express = require('express');
var User = require('../models/user');
var Wishlist = require('../models/wishlist');
var WishlistItem = require('../models/wishlistItem');
var Comment = require('../models/comment');
var myAuthMiddleware = require('../my_auth_middleware');

var router = express.Router({mergeParams:true});

//base route
//app.use('/user/:user_id/lists/:list_id/items', itemRoutes);

// ITEM - CREATE
// Create a new item for a wishlist.
router.post('/', myAuthMiddleware.isLoggedIn, myAuthMiddleware.isOwner, function(req, res){
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
// Show details, comments, and status for a specific item
router.get('/:item_id', myAuthMiddleware.isLoggedIn, myAuthMiddleware.isFriend, function(req, res){

    WishlistItem.findById(req.params.item_id).populate("comments").populate('claimedBy').exec(function(err, foundItem){
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
router.put('/:item_id/', myAuthMiddleware.isLoggedIn, myAuthMiddleware.isFriend, function(req, res){
    
    WishlistItem.findById(req.params.item_id).populate('claimedBy').exec(function(err, foundItem){
        if(err){
            console.log(err);
            res.redirect('back');
        } else {
            // Check if item is unclaimed in database or if claimed by user
            if(foundItem.purchaseStatus === 'Unclaimed' || foundItem.claimedBy._id.equals(req.user._id)){
                // Handle user claiming item
                if(foundItem.purchaseStatus === 'Unclaimed'){
                    foundItem.claimedBy = req.user;
                // Handle user relinquishing claim to item
                } else if(req.body.purchaseStatus === 'Unclaimed'){
                    foundItem.claimedBy = undefined;
                }
                // Update item's purchaseStatus
                foundItem.purchaseStatus = req.body.purchaseStatus;
                foundItem.save();
                res.json(foundItem);
            } else {
                res.json({cantClaim: true});
            }
        }
    })
});

// ITEM - DELETE
router.delete('/:item_id', myAuthMiddleware.isLoggedIn, myAuthMiddleware.isOwner, function(req, res){
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

module.exports = router;