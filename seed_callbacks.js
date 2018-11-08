var mongoose = require("mongoose");
var Wishlist = require("./models/wishlist");
var WishlistItem = require("./models/wishlistItem");
var Comment = require("./models/comment");
var Exchange = require("./models/exchange");
var Pairing = require("./models/pairing");
var User = require("./models/user");

function seedDB(){
    // Remove lists and friends from each user, remove users
    User.find({})
    .populate("friends")
    .populate("sentInvitations")
    .populate("receivedInvitations")
    .exec(function(err, users){
        if(err){
            console.log(err);
        } else {
            users.forEach(function(user){
                user.myLists = [];
                // Remove friends and invites
                user.friends = [];
                user.sentInvitations = [];
                user.receivedInvitations = [];
                user.save();
                console.log("Cleared user's friends and invites.")
            })
            User.remove({},function(err){
                if(err){
                    console.log(err);
                } else {
                    console.log("Removed users.")
                }
            })
        }
    })
    
    //remove all wishlist items
    WishlistItem.remove({}, function(err){
        if(err){
            console.log(err);
        } else {
            console.log("seedDB func has removed wishlist items.");
            // remove all wishlists
            Wishlist.remove({}, function(err){
                if(err){
                    console.log(err);
                } else {
                    console.log("seedDB func has removed wishlists.");
                    //remove all comments
                    Comment.remove({}, function(err){
                        if(err){
                            console.log(err);
                        } else {
                            console.log("seedDB func has removed comments.");
                        }
                    });
                }
            })
        }
    })

    //remove all exchanges and pairings
    Exchange.remove({}, function(err){
        if(err){
            console.log(err);
        } else {
            console.log("Removed exchanges.")
            Pairing.remove({}, function(err){
                if(err){
                    console.log(err);
                } else {
                    console.log("Removed pairings.")
                    User.find({}, function(err, foundUsers){
                        if(err){
                            console.log(err);
                        } else {
                            foundUsers.forEach(user => {
                                user.joinedExchanges = [];
                                user.save();
                            });
                            console.log("Cleared users' joinedExchanges.");
                        }
                    })
                }
            })
        }
    })
}

module.exports = seedDB;