const mongoose = require("mongoose")
const Schema = mongoose.Schema;

let UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    gender: { type: String, required: true},
    address: { type: String, required: true},
    role: {type: String, default: "user"},
    followers: [{
        follower_id: { type: mongoose.Schema.Types.ObjectId,ref: "User" },
        name: { type: String }
      }],
      following: [{
        following_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        name: { type: String }
      }],
  
}, {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});


const User = mongoose.model("User", UserSchema);
module.exports = User;
