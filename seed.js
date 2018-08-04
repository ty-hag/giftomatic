var mongoose = require("mongoose");
var Wishlist = require("./models/wishlist");
var WishlistItem = require("./models/wishlistItem");
var Comment = require("./models/comment");

var itemData = [
    {
        name: "iPad pro",
        purchaseStatus: "open",
        link: "https://www.amazon.com/Apple-iPad-12-9-Inch-Display-Space/dp/B0155OCLWK",
        price: "$540.00",
        notes: "Refurbished version is good."
    },
    {
        name: "Klay Thompson 'The Town' Jersey",
        purchaseStatus: "claimed",
        link: "http://www.warriorsteamstore.com/product/Golden_State_Warriors_Nike_Dri-FIT_Mens_Klay_Thompson__11_Swingman_Statement_Jersey_-_Grey",
        price: "$110.00",
        notes: "Size L. This is the replica, but if you want to get me the on-court version I won't object..."
    },
    {
        name: "Mario Tennis Aces for Switch",
        purchaseStatus: "purchased",
        link: "https://www.amazon.com/Mario-Tennis-Aces-Nintendo-Switch/dp/B078XYF9SV?th=1",
        price: "$65.00",
        notes: "Please check to make sure it's the download version."
    },
    {
        name: "Surfboard",
        purchaseStatus: "open",
        link: "https://www.evo.com/longboards/catch-surf-log-60-longboard#image=139094/581336/catch-surf-log-6-0-longboard-blue.jpg",
        price: "$345.00",
        notes: "Orange color please."
    }
];

var listData =[
    {
        name: "Christmas List",
        description: "This is what I want for CHRISTMAS y'all!",
    },
    {
        name: "Birthday List",
        description: "I need the sweet birthday material expression of love"
    }
];

function seedDB(){
    //remove all wishlist items
    WishlistItem.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("seedDB func has removed wishlist items.");
        // add item seed data
        itemData.forEach(function(seed){
            WishlistItem.create(seed, function(err, wishlistItem){
                if(err){
                    console.log(err);
                } else {
                    console.log(`Wishlist item added - ${seed.name}`);
                }
            });
        });
    });
    
    
    //remove comments
    Comment.remove({}, function(err){
        if(err){
            console.log(err);
        } else {
            console.log("Cleared comments.");
        }
    });
    
    
}

module.exports = seedDB;