const { User } = require('../models/index.model')
const validator = require("../helpers/validation")
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const Joi = require('joi');
saltRounds = 10;
const { errorResponse, successResponse } = require('../helpers/response')
var { generateWebToken } = require("../middlewares/jwt");
const emailSender = require('../helpers/nodemailer');
const mongoose = require('mongoose');


exports.create = async (req, res) => {
    try {
        let result = validator.both(req.body);
        if (!result.status) {
            errorResponse(422, result.message, res);
        } else {
            let count = await User.countDocuments({
                $or: [
                    { email: req.body.email },
                    { phone: req.body.phone }
                ]
            });
            if (count > 0) {
                errorResponse(401, "User already exists.", res);
            } else {
                bcrypt.genSalt(saltRounds, async function (err, salt) {
                    if (err) {
                        errorResponse(422, err.message, res);
                    } else {
                        bcrypt.hash(req.body.password, salt, async function (err, hash) {
                            if (err) {
                                errorResponse(422, err.message, res);
                            } else {
                                req.body.password = hash;
                                let user = await User(req.body).save();
                                if (!user) {
                                    errorResponse(400, "User not created.", res);
                                } else {
                                    // await emailSender.sendEmail(
                                    //     user.email,
                                    //     `Greetings from our company`,
                                    //     `Hello, ${user.name} Welcome to our website`
                                    // );
                                    successResponse(201, "User created successfully.", user, res);
                                }
                            }
                        });
                    }
                });
            }
        }
    } catch (error) {
        errorResponse(422, error.message, res);
    }
};




exports.index = async (req, res) => {
    try {
        let page = req.query.page ? parseInt(req.query.page) : 1;
        let limit = req.query.limit ? parseInt(req.query.limit) : 0;
        let skip = page > 1 ? (page - 1) * limit : 0;
console.log(page, limit, skip);
        User.find().skip(skip).limit(limit).then((docs) => {
            successResponse(200, "user Retrieved.", docs, res)
        })
            .catch((err) => {
                errorResponse(422, err.message, res)
            });
    }
    catch (err) {
        errorResponse(422, err.message, res)
    }
}


exports.show = async (req, res) => {
    try {
        if (req.userdata.id !== req.params.id) {
            errorResponse(401, "User does not exist", res)
        } else {
            User.findOne({ _id: req.params.id }).then((docs) => {
                successResponse(200, "user retrieved successfully.", docs, res)

            }).catch((err) => {
                errorResponse(422, err.message, res)
            })
        }
    } catch (err) {
        res.status(500).json(err)
    }
}


exports.update = async (req, res) => {
    try {
        const schema = Joi.object({
            email: Joi.string().email().optional(),
            phone: Joi.number().optional(),
            name: Joi.string().optional(),
            gender: Joi.string().optional(),
            address: Joi.string().optional()
        });

        const validation = schema.validate(req.body);
        if (validation.error) {
            errorResponse(401, error.message, res)
        }

        if (req.userdata.role !== "admin" || req.userdata.id !== req.params.id) {
            errorResponse(422, "Not authorized", res)
        }

        const updateObject = {};
        if (req.body.email && req.body.email !== "") {
            updateObject.email = req.body.email;
        }
        if (req.body.phone && req.body.phone !== "") {
            updateObject.phone = req.body.phone;
        }
        if (req.body.name && req.body.name !== "") {
            updateObject.name = req.body.name;
        }
        if (req.body.gender && req.body.gender !== "") {
            updateObject.gender = req.body.gender;
        }
        if (req.body.address && req.body.address !== "") {
            updateObject.address = req.body.address;
        }

        if (req.userdata.id === req.params.id) {
            User.updateOne({ _id: req.params.id }, { $set: updateObject })
                .then((docs) => {
                    successResponse(202, "user updated successfully", docs, res)
                })
                .catch((err) => {
                    errorResponse(422, err.message, res)
                });
        } else {
            errorResponse(401, "unauthorised user", res)
        }
    } catch (err) {
        errorResponse(401, err.message, res)
    }
};

exports.destroy = async (req, res) => {
    try {
        if (req.userdata.role == "admin") {
            User
                .deleteOne({ _id: req.params.id })
                .then((docs) => {
                    successResponse(200, "user deleted.", {}, res)
                })
                .catch((err) => {
                    errorResponse(422, err.message, res)
                });
        } else {
            errorResponse(422, err.message, res)
        }
    } catch (err) {
        errorResponse(422, err.message, res)
    }
};


exports.login = async (req, res) => {
    let result = validator.email(req.body);
    if (result.status === false) {
        errorResponse(422, "please provide valid email", res)
    } else {
        User.findOne({ email: req.body.email }).then((docs) => {
            if (!docs) {
                errorResponse(404, "not found", res)
            } else {
                if (bcrypt.compareSync(req.body.password, docs["_doc"].password) === true) {
                    docs["_doc"].auth_token = generateWebToken(docs._id);
                    successResponse(200, "user login successfully", docs, res)
                } else {
                    errorResponse(422, "Password does not match", res)
                }
            }
        });
    }

}


exports.followers = async (req, res) => {
    try {
        const following_id = req.params.following_id;
        const user_id = req.userdata.id;
        const follower = await User.findOne({ _id: user_id });
        const param_user = await User.findOne({ _id: following_id });
        let check = follower.following.find((follow) => {
            let objectId = new mongoose.Types.ObjectId(following_id);
            return follow.following_id.equals(objectId);
        });
        if (check) {
            return errorResponse(422, "Already following", res);
        } else {
            const object = {
                following_id: following_id,
                name: param_user.name
            };
            const obj = {
                follower_id: req.userdata.id,
                name: follower.name
            };
            let following = await User.updateOne({ _id: req.userdata.id }, { $addToSet: { following: object } });
            await User.updateOne({ _id: following_id }, { $addToSet: { followers: obj } });
            return successResponse(202, "Follower added", following, res);
        }
    } catch (error) {
        errorResponse(422, err.message, res);
    }
};





exports.unfollow = async (req, res) => {
    try {
        const unfollowerId = req.userdata.id;
        const followingId = req.params.unfollow;

        const unfollower = await User.findOne({ _id: unfollowerId });
        const unfollowedUser = await User.findOne({ _id: followingId });
        console.log(unfollower);

        let isFollowing = unfollower.following.find((follow) => {
            let objectId = new mongoose.Types.ObjectId(req.params.unfollow);
            return follow.following_id.equals(objectId);
        });
        // console.log(isFollowing);
        if (isFollowing) {
            const object = {
                following_id: followingId,
                name: unfollowedUser.name
            };
            console.log("object", object);
            // await User.updateOne({ _id: unfollowerId }, { $pull: { following: object } });

            successResponse(200, "Successfully unfollowed", res);
        } else {
            errorResponse(422, "Not unfollowed", res);
        }
    } catch (error) {
        errorResponse(422, "error.message", res);
    }
};
