var express = require('express');
var router = express.Router({mergeParams:true});
var Wishlist = require('../models/wishlist');
var User = require('../models/user');
var myAuthMiddleware = require('../my_auth_middleware');

router.get('/', myAuthMiddleware.isLoggedIn, myAuthMiddleware.isFriendOrOwner, function(req, res){
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
router.get('/new', myAuthMiddleware.isLoggedIn, myAuthMiddleware.isOwner, function(req, res){
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
router.post('/', myAuthMiddleware.isLoggedIn, myAuthMiddleware.isOwner, function(req, res){
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
router.get('/:list_id', myAuthMiddleware.isLoggedIn, myAuthMiddleware.isFriendOrOwner, function(req, res){
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

module.exports = router;