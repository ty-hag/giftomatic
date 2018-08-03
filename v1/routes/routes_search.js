var express = require('express');
var User = require('../models/user');

var router = express.Router({mergeParams:true});

// router.get('/', function(req, res){
//     res.render('search');
// })

router.get('/', function(req, res){
    User.find({}, function(err, searchResults){
        if(err){
            console.log(err);
        } else {
            console.log(searchResults)
            res.render('search', {searchResults: searchResults});
        }
    })
})

module.exports = router;