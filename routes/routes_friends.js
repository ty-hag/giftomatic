var express = require('express');
var User = require('../models/user');

var router = express.Router({mergeParams: true});

router.get("/", isLoggedIn, isOwner, function(req, res){
    // find and display a user's friends
    User.findById(req.params.user_id)
    .populate("friends")
    .exec(function(err, foundUser){
        if(err){
            console.log(err);
        } else {
            res.render("friends", {foundUser: foundUser});
        }
    })
})

// ------------ MIDDLEWARE -------------

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

// !@! this is broken
function isOwner(req, res, next){
    console.log("\nreq.params\n", req.params);
    console.log("\nreq.user\n", req.user);
    if(req.user._id.equals(req.params.user_id)){
        next();
    } else {
        res.send('You do not have access to that.');
    }
}

module.exports = router;