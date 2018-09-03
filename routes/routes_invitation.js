var express = require('express');
var mongoose = require('mongoose');
var User = require("../models/user");

var router = new express.Router({mergeParams: true});

router.get('/:id', isLoggedIn, function(req, res){
    User.findById(req.params.id).populate("invitations").exec(function(err, foundInvitee){
        if(err){
            console.log(err);
        } else {
            let invitationExists = foundInvitee.invitations.some(function(inviter){
                return inviter._id.equals(req.user._id);
            });
            if(invitationExists){
                res.json({rejected: true});
            } else {
                User.findById(req.user._id).populate("friends").exec(function(err, foundCurrentUser){
                    if(err){
                        console.log(err);
                    } else {
                        console.log("adding invitation");
                        // Add invitee to user's list of friends
                        // Status will be set as pending, so they are not friends yet
                        // Only once invitation is accepted will status change to friends
                        foundCurrentUser.friends.push(foundInvitee);
                        foundCurrentUser.save();

                        // Add invitation to invitee
                        foundInvitee.invitations.push(req.user);
                        foundInvitee.save();

                        // Send json response
                        res.json({
                            user: foundCurrentUser,
                            invitee: foundInvitee
                        })
                    }
                })
            }
        }
    })
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

module.exports = router;