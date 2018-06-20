var mongoose = require("mongoose");

var  wishlistItemSchema = new mongoose.Schema(
    {
        name: String,
        purchaseStatus: {type: String, default: "open"},
        link: String,
        price: String,
        notes: String,
        comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Comments'
            }
        ]
    }
);

module.exports = mongoose.model("WishlistItem", wishlistItemSchema);