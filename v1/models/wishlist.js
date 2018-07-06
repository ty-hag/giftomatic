var mongoose = require('mongoose');

var wishlistSchema = new mongoose.Schema(
    {
        name: String,
        description: String,
        owner: {type: String, default: "Yadly"},
        items: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'wishlistItem'
            }
        ]
    }
);

module.exports = mongoose.model('Wishlist', wishlistSchema);