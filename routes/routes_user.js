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