var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema(
    {
        firstName: String,
        lastName: String,
        password: String,
        username: String,
        myLists: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Wishlist"
            }
        ]
    }
)

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", UserSchema);