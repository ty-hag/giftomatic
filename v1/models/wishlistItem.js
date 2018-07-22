var mongoose = require("mongoose");

var  wishlistItemSchema = new mongoose.Schema(
    {
        name: String,
        purchaseStatus: {type: String, default: "unclaimed"},
        link: String,
        price: String,
        notes: String,
        comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Comment'
            }
        ]
    }
);

module.exports = mongoose.model("WishlistItem", wishlistItemSchema);