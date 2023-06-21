const mongoose = require("mongoose")
const Schema = mongoose.Schema;

let PostSchema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "User"},
    photos: [String]
}, {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});


const Post = mongoose.model("Post", PostSchema);
module.exports = Post;
