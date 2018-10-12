var express = require('express');
var User = require('../models/user');
var Wishlist = require('../models/wishlist');
var WishlistItem = require('../models/wishlistItem');
var Comment = require('../models/comment');
var myAuthMiddleware = require("../my_auth_middleware");

var router = express.Router({mergeParams:true});

// COMMENT - CREATE
router.post('/', myAuthMiddleware.isLoggedIn, myAuthMiddleware.isFriend, function(req, res){
    console.log('req.params.id: \n', req.params.id);
    
    Comment.create(req.body.comment, function(err, newComment){
        if(err){
            console.log(err);
        } else {
            console.log('req.user: \n', req.user);
            newComment.author = req.user;
            newComment.save();
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


module.exports = router;