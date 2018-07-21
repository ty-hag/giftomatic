var express = require('express');
var router = express.Router({mergeParams:true});
var Wishlist = require('../models/wishlist');
var User = require('../models/user');

router.get('/', isLoggedIn, function(req, res){
    User.findById(req.params.user_id).populate('myLists').exec(function(err, foundUser){
        if(err){
            console.log(err)
            res.redirect(`/`) //!@! change this later
        } else {
            console.log('foundUser: ', foundUser);
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
    let listToCreate = req.body.newList;
    Wishlist.create(req.body.newList, function(err, newList){
        if(err){
            console.log(err);
            res.redirect(`/user/${req.params.user_id}/lists/new`);
        } else {
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
router.get('/:list_id', isLoggedIn, function(req, res){
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

function isCurrentUser(req, res, next){
    if(req.user === req.params.id){
        return next();
    }
    res.send("You do not have permission to access that thing!");
}

module.exports = router;