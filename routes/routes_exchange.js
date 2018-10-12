var express = require("express");
var mongoose = require("mongoose");
var User = require("../models/user");
var Exchange = require("../models/exchange");
var Pairings = require("../models/pairings");
var myAuthMiddleware = require("../my_auth_middleware");

var router = express.Router({mergeParams: true});

// Show info from exchanges user is participating in, link to create new exchange
router.get('/', myAuthMiddleware.isLoggedIn, myAuthMiddleware.isOwner, function(req, res){
    //need to get user's exchange/pairing info
    res.render("exchange");
})

router.get('/new', myAuthMiddleware.isLoggedIn, myAuthMiddleware.isOwner, function(req, res){
    res.render('newExchange');
})

router.post('/addNew', myAuthMiddleware.isLoggedIn, myAuthMiddleware.isOwner, function(req, res){
    Exchange.create(req.body.newExchange, function(err, newExchange){
        if(err){
            console.log(err)
        } else {
            newExchange.admin = req.user;
            newExchange.save();
            console.log(newExchange);
        }
    })
    res.send("submitted");
})

module.exports = router;