var mongoose = require("mongoose");

var exchangeSchema = new mongoose.Schema(
    {
        name: String,
        admin: {
            type: mongoose.Schema.Types.ObjectId,
            reg: "User"
        },
        members: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        pairings: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        spendLimit: Number
    }
)

module.exports = mongoose.model("Exchange", exchangeSchema);