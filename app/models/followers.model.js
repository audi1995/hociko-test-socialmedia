const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let followerSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true },
    followers: [{ type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" }],
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const Follower = mongoose.model("Follower", followerSchema);
module.exports = Follower;
