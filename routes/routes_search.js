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
            searchResults.sort(function(a, b){
                if(a.lastName.toLowerCase() > b.lastName.toLowerCase()){
                    return 1;
                } else if (a.lastName.toLowerCase() < b.lastName.toLowerCase()){
                    return -1;
                } else {
                    return 0;
                }
            })
            console.log(searchResults);
            res.render('search', {searchResults: searchResults});
        }
    })
})

module.exports = router;