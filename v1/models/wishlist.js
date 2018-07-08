var mongoose = require('mongoose');

var wishlistSchema = new mongoose.Schema(
    {
        name: String,
        summary: String,
        owner: {type: String, default: "Yadly"},
        items: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'WishlistItem'
            }
        ]
    }
);

module.exports = mongoose.model('Wishlist', wishlistSchema);