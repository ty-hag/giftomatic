var mongoose = require("mongoose");
var WishlistItem = require("./models/wishlistItem");

var data = [
    {
        name: "iPad pro",
        purchaseStatus: "open",
        link: "https://www.amazon.com/Apple-iPad-12-9-Inch-Display-Space/dp/B0155OCLWK",
        price: "$540.00",
        notes: "I don't mind the refurbished version.\nAny color other than pink gold is fine."
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
    }
];

function seedDB(){
    //remove all wishlist items
    WishlistItem.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("seedDB func has removed wishlist items.");
        // add seed data
        data.forEach(function(seed){
            WishlistItem.create(seed, function(err, wishlistItem){
                if(err){
                    console.log(err);
                } else {
                    console.log(`Wishlist item added - ${seed.name}`);
                }
            })
        })
    })
}

module.exports = seedDB;