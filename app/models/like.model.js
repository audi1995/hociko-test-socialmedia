const mongoose = require("mongoose")
const Schema = mongoose.Schema;

let likeSchema = new Schema({
    like: { type: Boolean, required: true},
    post: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Post" },
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" }
},
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
    });


const Like = mongoose.model("Like", likeSchema);
module.exports = Like;
