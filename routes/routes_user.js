var express = require('express');
var router = express.Router({mergeParams: true});
var User = require('../models/user');

router.get('/:id', isLoggedIn, function(req, res){
    User.findById(req.params.id, function(err, foundUser){
        if(err){
            console.log(err);
            res.redirect(`/user/${req.user._id}`, {user: req.user._id});
        } else {
            res.render(`user`, {user: foundUser});
        }
    })
});

// ------------------- MIDDLEWARE ---------------------------

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

function isFriend(req, res, next){
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

module.exports = router;