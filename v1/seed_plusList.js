var mongoose = require("mongoose");
var Wishlist = require("./models/wishlist");
var WishlistItem = require("./models/wishlistItem");
var Comment = require("./models/comment");

var itemSeedData = [
    {
        name: "iPad pro",
        purchaseStatus: "open",
        link: "https://www.amazon.com/Apple-iPad-12-9-Inch-Display-Space/dp/B0155OCLWK",
        price: "$540.00",
        notes: "Pad town"
    },
    {
        name: "Klay Thompson 'The Town' Jersey",
        purchaseStatus: "claimed",
        link: "http://www.warriorsteamstore.com/product/Golden_State_Warriors_Nike_Dri-FIT_Mens_Klay_Thompson__11_Swingman_Statement_Jersey_-_Grey",
        price: "$110.00",
        notes: "It's a jersey."
    },
    {
        name: "Mario Tennis Aces",
        purchaseStatus: "purchased",
        link: "https://www.amazon.com/Mario-Tennis-Aces-Nintendo-Switch/dp/B078XYF9SV?th=1",
        price: "$65.00",
        notes: "Tennis game"
    },
    {
        name: "Surfboard",
        purchaseStatus: "open",
        link: "https://www.evo.com/longboards/catch-surf-log-60-longboard#image=139094/581336/catch-surf-log-6-0-longboard-blue.jpg",
        price: "$345.00",
        notes: "Orange color please"
    }
];

var listSeedData =[
    {
        name: "Christmas List",
        description: "This is what I want for CHRISTMAS y'all!"
    },
    {
        name: "Birthday List",
        description: "I need the sweet birthday material expression of love"
    }
];

function seedDB(){
    //remove wishlist items
    WishlistItem.remove({}).exec()
    .then(function(){
        //remove wishlists
        console.log("Removing wishlists.")
        return Wishlist.remove({}).exec();
    })
    .then(function(){
        //remove comments
        console.log("Removing comments.")
        return Comment.remove({}).exec();
    })
    .then(function(){
        //add wishlist items
        return new Promise(function(){
            itemSeedData.forEach(function(seed){
                WishlistItem.create(seed, function(err, wishlistItem){
                    if(err){
                        console.log(err);
                    } else {
                        console.log(`Wishlist item added - ${seed.name}`);
                    }
                });
                console.log("hey")
            });
        });
    })
    .then(function(){
        //add wishlists
        return new Promise(function(){
            listSeedData.forEach(function(seed){
                Wishlist.create(seed, function(err, wishlist){
                    if(err){
                        console.log(err);
                    } else {
                        console.log(`Wishlist added - ${seed.name}`);
                    }
                });
            });
        });
    })
    .then(function(){
        console.log("Execute last function?");
    });

}

module.exports = seedDB;