var express = require('express');
var router = express.Router({mergeParams: true});

router.get('/user/:id', function(req, res){
    User.findById(req.params.id, function(err, foundUser){
        if(err){
            console.log(err);
            res.redirect(`/user/${req.user._id}`, {user: req.user._id});
        } else {
            res.render(`user`, {user: foundUser});
        }
    })
});