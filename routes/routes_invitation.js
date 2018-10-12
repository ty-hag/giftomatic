var express = require('express');
var mongoose = require('mongoose');
var User = require("../models/user");
var myAuthMiddleware = require("../my_auth_middleware");

var router = new express.Router({mergeParams: true});

// Handle sending of friend invitations
router.get('/sendInvite/:id', myAuthMiddleware.isLoggedIn, myAuthMiddleware.isOwner, function(req, res){
    User.findById(req.params.id)
    .populate("sentInvitations")
    .populate("receivedInvitations")
    .populate("friends")
    .exec(function(err, foundInvitee){
        if(err){
            console.log(err);
        } else {
            User.findById(req.user._id)
            .populate("sentInvitations")
            .populate("receivedInvitations")
            .populate("friends")
            .exec(function(err, foundCurrentUser){
                if(err){
                    console.log(err);
                } else {

                    console.log("sent data:\n", req.body);

                    // Handle cases where users are already friends,
                    // user has already sent invitation to invitee, or vice-versa
                    let alreadyFriends = foundCurrentUser.friends.some(function(friend){
                        return friend._id.equals(foundCurrentUser._id);
                    })
                    let invitationExists = foundCurrentUser.sentInvitations.some(function(invited){
                        return invited._id.equals(foundInvitee._id);
                    });
                    let invitedByInvitee = foundInvitee.sentInvitations.some(function(invited){
                        return invited._id.equals(foundCurrentUser._id);
                    });
                    if(alreadyFriends || invitationExists || invitedByInvitee){
                        res.json({rejected: true});
                        console.log(`Invite failed`);
                        console.log(`alreadyFriends ${alreadyFriends}`);
                        console.log(`invitationExists ${invitationExists}`);
                        console.log(`invitedByInvitee ${invitedByInvitee}`);


                    // Handle adding of invitation
                    } else {
                        console.log("adding invitation");
                        // Add invitee to user's list of friends
                        // Status will be set as pending, so they are not friends yet
                        // Only once invitation is accepted will status change to friends
                        foundCurrentUser.sentInvitations.push(foundInvitee);
                        foundCurrentUser.save();
                        // console.log("\n foundCurrentUser after save:\n", foundCurrentUser);
                        // console.log("\n invitation entry check", foundCurrentUser.sentInvitations);

                        // Add invitation to invitee
                        foundInvitee.receivedInvitations.push(foundCurrentUser);
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
router.get('/', myAuthMiddleware.isLoggedIn, myAuthMiddleware.isOwner, function(req, res){
    User.findById(req.params.user_id)
    .populate('receivedInvitations')
    .populate('sentInvitations')
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
router.post('/answer/:inviter_id', myAuthMiddleware.isLoggedIn, myAuthMiddleware.isOwner, function(req, res){

        console.log("Accept/reject route hit.");
        User.findById(req.params.user_id)
        .populate("sentInvitations")
        .populate("receivedInvitations")
        .populate("friends")
        .exec(function(err, foundUser){
            if(err){
                console.log(err)
            } else {
                User.findById(req.params.inviter_id)
                .populate("sentInvitations")
                .populate("receivedInvitations")
                .populate("friends")
                .exec(function(err, foundInviter){
                    if(err){
                        console.log(err)
                    } else {
                        // Handle accepted invitation
                        if(req.body.answer === "accept"){
                            console.log("Invitation accepted.");
                            // Add inviter to current user's list of friends, vice versa
                            foundUser.friends.push(foundInviter);
                            foundInviter.friends.push(foundUser);
                        }

                        // Handle rejection
                        // - Both accpetance/rejection remove sent and received invitations from each user
                        // - The difference is accepted invitations are processed by saving
                        //   the users to one another's friends lists, as above
                        
                        // Remove invitation from user's received invitations 
                        foundUser.receivedInvitations.forEach(function(invitation){
                            if(invitation._id.equals(req.params.inviter_id)){
                                let index = foundUser.receivedInvitations.indexOf(invitation);
                                if(index > -1){
                                    foundUser.receivedInvitations.splice(index, 1);
                                }
                            }
                        });    
                        // Remove invitation from inviter's sent invitations
                        if(foundInviter.sentInvitations.length > 0){
                            foundInviter.sentInvitations.forEach(function(invitation){
                                if(invitation._id.equals(req.params.id)){
                                    let index = foundInviter.sentInvitations.indexOf(invitation);
                                    if(index > -1){
                                        foundInviter.sentInvitations.splice(index, 1);
                                    }
                                }
                            })
                        }

                        // save changes
                        foundUser.save();
                        foundInviter.save();
                    }
                })
            }
        })
    // Do I really need to send an object here?
    res.json({sendAnswer: req.body.answer})
});

module.exports = router;