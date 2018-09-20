var express = require('express');
var mongoose = require('mongoose');
var User = require("../models/user");

var router = new express.Router({mergeParams: true});

// Handle sending of invitations
router.get('/sendInvite/:id', isLoggedIn, function(req, res){
    User.findById(req.params.id)
    .populate("invitations")
    .populate("friends")
    .exec(function(err, foundInvitee){
        if(err){
            console.log(err);
        } else {

            User.findById(req.user._id)
            .populate("friends")
            .exec(function(err, foundCurrentUser){
                if(err){
                    console.log(err);
                } else {

                    console.log("sent data:\n", req.body);

                    // Handle case where invitee has already invited current user or vice-versa
                    let invitationExists = foundInvitee.invitations.some(function(inviter){
                        return inviter._id.equals(req.user._id);
                    });
                    let invitedByInvitee = foundInvitee.friends.some(function(friend){
                        return friend._id.equals(foundCurrentUser._id);
                    });
                    if(invitationExists || invitedByInvitee){
                        res.json({rejected: true});
                        console.log("Invite failed.");

                    // Handle adding of invitation
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
                    
                }
            })
        }
    })
});

// View a user's invitations
router.get('/:id', isLoggedIn, function(req, res){
    User.findById(req.params.id)
    .populate('invitations')
    .populate('friends')
    .exec(function(err, foundUser){
        if(err){
            console.log(err)
        } else {
            res.render('invitations', {user: foundUser});
        }
    })
})

// Handle accept/reject of invitation
router.post('/:id/answer/:inviter_id', isLoggedIn, function(req, res){
    console.log("accept/reject route hit");
    console.log('req.body:\n', req.body);
    console.log(req.body.answer);

        User.findById(req.params.id)
        .populate("invitations")
        .populate("friends")
        .exec(function(err, foundUser){

            User.findById(req.params.inviter_id)
            .populate("invitations")
            .populate("friends")
            .exec(function(err, foundInviter){

                // Handle accepted invitation
                if(req.body.answer === "accept"){
                    
                    // Add inviter to current user's list of friends
                    foundUser.friends.push(foundInviter);
                    foundUser.friends[foundUser.friends.length - 1].friendStatus = "friends";
                    // Remove invitation
                    foundUser.invitations.forEach(function(invitation){
                        if(invitation._id.equals(req.params.inviter_id)){
                            let index = foundUser.invitations.indexOf(invitation);
                            if(index > -1){
                                foundUser.invitations.splice(index, 1);
                            }
                        }
                    })
                    foundUser.save();
                    
                    // find current user among inviter's friend list, change status to friends
                    if(foundInviter.friends.length > 0){
                        foundInviter.friends.forEach(function(friend){
                            if(friend._id.equals(req.params.id)){
                                friend.friendStatus = 'friends';
                            }
                        })
                    }
                    foundInviter.save();
                    console.log("foundUser after:\n", foundUser);
                    console.log("foundInviter after:\n", foundInviter);
                
                // Handle rejected invitation
                } else if (req.body.answer === "reject"){
                    console.log("rejected invite");
                    
                    // Remove invitation from cUser's list of invitations
                    foundUser.invitations.forEach(function(invitation){
                        if(invitation._id.equals(req.params.inviter_id)){
                            let index = foundUser.invitations.indexOf(invitation);
                            if(index > -1){
                                foundUser.invitations.splice(index, 1);
                            }
                        }
                    })
                    foundUser.save();

                    // Remove "pending" friend from inviter's list of friends
                    if(foundInviter.friends.length > 0){
                        foundInviter.friends.forEach(function(friend){
                            if(friend._id.equals(foundUser._id)){
                                let index = foundInviter.friends.indexOf(friend);
                                foundInviter.friends.splice(index, 1);
                            }
                        });
                    }
                    foundInviter.save();
                    console.log("foundUser after:\n", foundUser);
                    console.log("foundInviter after:\n", foundInviter);
                }
            });
        })
        
    res.json({sendAnswer: req.body.answer})
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

module.exports = router;