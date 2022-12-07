const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Password = new Schema({
    hash: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Password", Password);
