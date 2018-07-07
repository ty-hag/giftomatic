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
        } else {
            console.log("seedDB func has removed wishlist items.");
            // remove all wishlists
            Wishlist.remove({}, function(err){
                if(err){
                    console.log(err);
                } else {
                    console.log("seedDB func has removed wishlists.");
                    //remove all comments
                    Comment.remove({}, function(err){
                        if(err){
                            console.log(err);
                        } else {
                            console.log("seedDB func has removed comments.");
                            // add item seed data
                            WishlistItem.create(itemData, function(err, items){
                                if(err){
                                    console.log(err);
                                } else {
                                    console.log(`Wishlist items added - \n${items}`);
                                    Wishlist.create(listData, function(err, lists){
                                        if(err){
                                            console.log(err);
                                        } else {
                                            console.log(`Wishlists added - \n${lists}`);
                                            items.forEach(function(item){
                                                lists[0].items.push(item);
                                            });
                                            console.log(`list 0: ${lists[0]}`);
                                        }
                                    })
                                }
                            });
                        }
                    });
                }
            })
        }
    })
}

module.exports = seedDB;