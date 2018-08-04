var mongoose = require("mongoose");

var  wishlistItemSchema = new mongoose.Schema(
    {
        name: String,
        purchaseStatus: {type: String, default: "Unclaimed"},
        link: String,
        price: String,
        notes: String,
        comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Comment'
            }
        ],
        claimedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }
);

module.exports = mongoose.model("WishlistItem", wishlistItemSchema);