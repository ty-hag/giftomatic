var express = require('express');
var router = express.Router({mergeParams:true});
var Wishlist = require('../models/wishlist');
var User = require('../models/user');

router.get('/', isLoggedIn, isFriendOrOwner, function(req, res){
    User.findById(req.params.user_id).populate('myLists').exec(function(err, foundUser){
        if(err){
            console.log(err)
            res.redirect(`/`) //!@! change this later
        } else {
            res.render('lists', {user: foundUser});
        }
    })
})

// LIST - NEW
router.get('/new', isLoggedIn, function(req, res){
    User.findById(req.params.user_id, function(err, foundUser){
        if(err){
            console.log(err);
            res.redirect('/') //!@! change this later
        } else {
            // passing user despite the fact that it should always be currentUser, never any other user
            // UNLESS we allow users to create lists for others (ie parent for child)
            res.render('newList', {user: foundUser});
        }
    })
});

// LIST - CREATE
router.post('/', isLoggedIn, function(req, res){
    Wishlist.create(req.body.newList, function(err, newList){
        if(err){
            console.log(err);
            res.redirect(`/user/${req.params.user_id}/lists/new`);
        } else {
            newList.owner = req.user;
            newList.save();
            User.findById(req.params.user_id, function(err, foundUser){
                if(err){
                    console.log(err);
                } else {
                    foundUser.myLists.push(newList._id);
                    foundUser.save();
                    res.redirect(`/user/${req.params.user_id}/lists/${newList._id}`);
                }
            })
        }
    })
})

// LIST - SHOW
router.get('/:list_id', isLoggedIn, isFriendOrOwner, function(req, res){
    Wishlist.findById(req.params.list_id).populate('items').exec(function(err, foundList){
        if(err){
            console.log(err);
            res.redirect("/lists");
        } else {
            User.findById(req.params.user_id, function(err, foundUser){
                if(err){
                    console.log(err);
                    res.redirect('/');
                } else {
                    res.render('wishlist_items', {list: foundList, user: foundUser});
                }
            })
        }
    });
});


//------------ LOGIN MIDDLEWARE ---------------------
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

function isFriendOrOwner(req, res, next){
    console.log("isFriend hit");
    console.log("req.params:\n", req.params);
    User.findById(req.params.user_id)
    .populate("friends")
    .exec(function(err, foundUser){
        if(err){
            console.log(err);
        } else {
            let cUserIsFriend = false;
            console.log("foundUser:\n", foundUser);
            // If user has friends (list is 1 or more), check to see if requested page's owner is among them
            if(foundUser.friends.length > 0){
                cUserIsFriend = foundUser.friends.some(function(friend){
                    return friend._id.equals(req.user.id);
                });
            // If user has no friends, set friend check to false
            }
            console.log("cUserIsFriend value:\n", cUserIsFriend);

            // If friend or owner, grant permission, otherwise send message
            if(cUserIsFriend || req.user.id === req.params.user_id){
                console.log("permission granted");
                return next();
            } else {
                res.send("You must be friends with the user to access this page.");
            }
        }
    })
}

module.exports = router;