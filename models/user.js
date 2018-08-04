var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema(
    {
        firstName: {type: String, required: true},
        lastName: {type: String, required: true},
        username: {type: String, required: true},
        myLists: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Wishlist"
            }
        ],
        claimedItems: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "WishlistItem"
            }
        ]
    }
)

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", UserSchema);