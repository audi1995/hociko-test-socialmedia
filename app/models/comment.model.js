const mongoose = require("mongoose")
const Schema = mongoose.Schema;

let CommentSchema = new Schema({
    comment: { type: String, required: true },
    post: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Post" },
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" }

},
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
    });


const Comment = mongoose.model("Comment", CommentSchema);
module.exports = Comment;
