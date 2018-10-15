var mongoose = require("mongoose");

var pairingSchema = new mongoose.Schema(
    {
        assignee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        pair: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        status: String,
        notesFromPair: Array,
        exchangeGroup: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Exchange"
        }
    }
)

module.exports = mongoose.model("Pairing", pairingSchema);