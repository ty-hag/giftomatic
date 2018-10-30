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
        status: {type:String, default:"Pending"},
        notesFromPair: {type:String, default:"No notes yet."},
        notesForPair: {type:String, default:"No notes yet."},
        exchangeGroup: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Exchange"
        }
    }
)

module.exports = mongoose.model("Pairing", pairingSchema);