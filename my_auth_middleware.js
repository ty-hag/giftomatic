var express = require("express");
var mongoose = require("mongoose");

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

module.exports = myAuthMiddleware;