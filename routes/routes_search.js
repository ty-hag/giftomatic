var express = require('express');
var User = require('../models/user');

var router = express.Router({mergeParams:true});

router.get('/', isLoggedIn, function(req, res){
    User.find({}, function(err, searchResults){
        if(err){
            console.log(err);
        } else {
            // Remove current user's own entry
            searchResults.forEach(result =>{
                if(result._id.equals(req.user._id)){
                    searchResults.splice(searchResults.indexOf(result), 1);
                }
            })
            // Remove users who have been sent an invite
            if(req.user.friends.length > 0 && searchResults.length > 0){
                req.user.friends.forEach(friend => {
                    searchResults.forEach(result =>{
                        console.log("friend id:", friend._id);
                        console.log("search result user id:",req.user._id);
                        if(friend._id.equals(result._id)){ // Not sure that friend.friendObject works
                            searchResults.splice(searchResults.indexOf(result), 1);
                        }
                    })
                })
            }
            // Put results in alphebetical order by last name
            searchResults.sort(function(a, b){
                if(a.lastName.toLowerCase() > b.lastName.toLowerCase()){
                    return 1;
                } else if (a.lastName.toLowerCase() < b.lastName.toLowerCase()){
                    return -1;
                } else {
                    return 0;
                }
            })
            res.render('search', {searchResults: searchResults});
        }
    })
})

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

module.exports = router;