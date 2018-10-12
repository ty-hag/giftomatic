var express = require("express");
var mongoose = require("mongoose");
var User = require("./models/user");

var myAuthMiddleware = {};

// Prevents users who have not logged in from accessing page
myAuthMiddleware.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

// Prevents everyone but user that owns that page (list) from accessing route
myAuthMiddleware.isOwner = function(req, res, next){
    console.log("isOwner hit");
    if(req.user._id.equals(req.params.user_id)){
        next();
    } else {
        res.send('You have tried to access a page you don\'t own.');
    }
}

// Prevents people who are not friends with owner from accessing page
// Also excludes owner themself
myAuthMiddleware.isFriend = function(req, res, next){
    console.log("isFriend hit");
    User.findById(req.params.user_id)
    .populate("friends")
    .exec(function(err, foundUser){
        let cUserIsFriend = foundUser.friends.some(function(friend){
            return friend._id.equals(req.user.id);
        });
        if(cUserIsFriend){
            console.log("found friend");
            return next();
        } else {
            res.send("You must be friends with the user to access this page.");
        }
    })
}

myAuthMiddleware.isFriendOrOwner = function(req, res, next){
    console.log("isFriend hit");
    User.findById(req.params.user_id)
    .populate("friends")
    .exec(function(err, foundUser){
        if(err){
            console.log(err);
        } else {
            let cUserIsFriend = false;
            // If user has friends (list is 1 or more), check to see if requested page's owner is among them
            if(foundUser.friends.length > 0){
                cUserIsFriend = foundUser.friends.some(function(friend){
                    return friend._id.equals(req.user.id);
                });
            // If user has no friends, set friend check to false
            }

            // If friend or owner, grant permission, otherwise send message
            if(cUserIsFriend || req.user.id === req.params.user_id){
                return next();
            } else {
                res.send("You must be friends with the user to access this page.");
            }
        }
    })
}

module.exports = myAuthMiddleware;