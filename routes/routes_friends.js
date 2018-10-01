var express = require('express');
var User = require('../models/user');
var myAuthMiddleware = require('../my_auth_middleware');

var router = express.Router({mergeParams: true});

router.get("/", myAuthMiddleware.isLoggedIn, myAuthMiddleware.isOwner, function(req, res){
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

module.exports = router;