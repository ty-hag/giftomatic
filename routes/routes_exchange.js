var express = require("express");
var mongoose = require("mongoose");
var User = require("../models/user");
var Exchange = require("../models/exchange");
var Pairings = require("../models/pairing");
var myAuthMiddleware = require("../my_auth_middleware");

var router = express.Router({mergeParams: true});

// Show info from exchanges user is participating in, link to create new exchange
router.get('/', myAuthMiddleware.isLoggedIn, myAuthMiddleware.isOwner, function(req, res){
    //need to get user's exchange/pairing info
    res.render("exchange");
})

// Show new exchange creation page
router.get('/new', myAuthMiddleware.isLoggedIn, myAuthMiddleware.isOwner, function(req, res){
    User.findById(req.user)
    .populate('friends')
    .exec(function(err, foundUser){
        if(err){
            console.log(err);
        } else {
            res.render('newExchange', {foundUser : foundUser});
        }
    })
})

router.post('/addNew', myAuthMiddleware.isLoggedIn, myAuthMiddleware.isOwner, function(req, res){
    console.log("req.body:\n", req.body)
    // Exchange.create(req.body.newExchange, function(err, newExchange){
    //     if(err){
    //         console.log(err)
    //     } else {
    //         newExchange.admin = req.user;
    //         newExchange.save();
    //         console.log(newExchange);
    //         res.send(newExchange);
    //         //res.redirect(`/users/${req.user.id}/exchange/${newExchange._id}/setup/`)
    //     }
    // })
    res.send("Nice one");
})

module.exports = router;