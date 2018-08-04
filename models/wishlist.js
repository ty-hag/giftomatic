var mongoose = require('mongoose');

var wishlistSchema = new mongoose.Schema(
    {
        name: String,
        summary: String,
        owner: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
        items: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'WishlistItem'
            }
        ]
    }
);

module.exports = mongoose.model('Wishlist', wishlistSchema);