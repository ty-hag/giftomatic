var express = require("express");
var mongoose = require("mongoose");
var User = require("../models/user");
var Exchange = require("../models/exchange");
var Pairings = require("../models/pairing");
var myAuthMiddleware = require("../my_auth_middleware");

var router = express.Router({mergeParams: true});

// Show info from exchanges user is participating in, link to create new exchange
router.get('/', myAuthMiddleware.isLoggedIn, myAuthMiddleware.isOwner, function(req, res){
    // Get info from user's current exchanges
    User.findById(req.params.user_id)
    .populate("joinedExchanges")
    .exec(function(err, foundUser){
        console.log('foundUser.joinedExchanges:');
        console.log(foundUser.joinedExchanges);
        res.render("exchange", {
            foundUser: foundUser,
        });
    })
});

// Show new exchange creation page
router.get('/new', myAuthMiddleware.isLoggedIn, myAuthMiddleware.isOwner, function(req, res){
    User.findById(req.user)
    .populate('friends')
    .exec(function(err, foundUser){
        if(err){
            console.log(err);
        } else {
            res.render('newExchange', {foundUser : foundUser});
        }
    })
})

// Process creation of new exchange
router.post('/addNew', myAuthMiddleware.isLoggedIn, myAuthMiddleware.isOwner, function(req, res){
    console.log("Hit new exchange creation route.");
    // List of participant ID strings
    let idStrings = req.body.newExchange.members; // This will be used later
    // Convert array of user ID strings to User ID objects
    let participantIds = idStrings.map(id => mongoose.Types.ObjectId(id));
    // Add current user to list of participants
    participantIds.push(req.user._id);
    // Get User database entries for each participant
    User.find({
        '_id': { $in: participantIds }
    }, function(err, foundIds){
        if(err){
            console.log(err);
        } else {
            Exchange.create({}, function(err, createdExchange){
                if(err){
                    console.log(err)
                } else {
                    createdExchange.members = foundIds;
                    createdExchange.admin = req.user;
                    createdExchange.save();

                    // Save this exchange to each user's joinedExchanges attribute
                    foundIds.forEach(function(user){
                        user.joinedExchanges.push(createdExchange._id);
                        user.save();
                    })

                    // Create a list of objects to pass for pairing creation
                    let pairingCreationList = [];
                    createdExchange.members.forEach(function(member){
                        var addAssigneeObject = {};
                        addAssigneeObject.assignee = member;
                        pairingCreationList.push(addAssigneeObject);
                    });

                    // Create initial pairing objects with list of participants.
                    // Pairs will not be assigned yet. Only the "assignee" field
                    // will be filled
                    Pairings.create(pairingCreationList, function(err, createdPairings){
                        if(err){
                            console.log(err);
                        } else {

                            // Getting actual pairs here. First duplicate and shuffle list of
                            // participants, then try to match them by looping over the original list
                            // and comparing it to the last entry in the shuffled list.
                            // If the last entry doesn't match, pair them up. If it does,
                            // pair with the first entry.

                            // Shuffle original list
                            let shuffledList = shuffle(createdExchange.members.slice());

                            // Loop over original list and test for matches
                            createdPairings.forEach(function(pairing){
                                let endOfList = shuffledList[shuffledList.length - 1];
                                if(!pairing.assignee._id.equals(endOfList._id)){
                                    // Person at end of list did not match assignee, making a pair.
                                    pairing.pair = shuffledList.pop();
                                } else {
                                    // Person at end of list matched assignee, making pair from first
                                    // person on list.
                                    pairing.pair = shuffledList.shift();
                                }
                            })
                            // Save updates to pairings.
                            createdPairings.forEach(pairing => pairing.save());
                            // Add pairings to exchange object
                            createdPairings.forEach(pairing => createdExchange.pairings.push(pairing._id));
                            createdExchange.save();
                            res.redirect(`/user/${req.user.id}/exchange/`);;
                        }
                    })
                }
            })
        }
    })
})

function assignPairs(participantList){
    let pairingList = shuffle(participantList.slice());

    participantList.forEach(function(assignee){
        console.log('pairing:');
        console.log('assignee: ', assignee.firstName);
        // Check to see if last entry of pairing list matches original list
        // If it doesn't, add as pair
        if(pairingList[pairingList.length - 1]._id.equals(assignee._id)){
            
        } else {
            console.log('did not match at end of list')
            console.log('pair:',pairingList.pop().firstName);
        }
        // console.log("\n");
        // console.log(`assignee._id:\n`,assignee._id)
        // console.log(`last obj id on pairingList:\n`, pairingList[pairingList.length -1]._id);
        // console.log(`first obj id on pairingList:\n`, pairingList[0]._id);
        console.log('\n');
    })
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }


module.exports = router;