const { Post, User } = require('../models/index.model')
const { errorResponse, successResponse } = require('../helpers/response')
const Joi = require("joi");


exports.create = (req, res) => {
    try {
        let author = req.userdata.id
        new Post({
            ...req.body,
            author: author
        }).save().then((docs) => {
            successResponse(201, "Post created.", docs, res);
        }).catch((err) => {
            errorResponse(422, err.message, res);
        });
    } catch (err) {
        errorResponse(422, err.message, res)
    }
}


exports.index = (req, res) => {
    Post.find().then((docs) => {
        successResponse(200, "posts retrieved successfully", docs, res)
    }).catch((err) => {
        errorResponse(422, err.message, res)
    })
}


exports.show = async (req, res) => {
    try {
        let user = await User.findOne({ _id: req.userdata.id })
        if (req.userdata.id === user.id) {

            const post = await Post.findOne({ _id: req.params.id }).populate("author");
            if (post) {
                successResponse(200, "post retrieved successfully", docs, res)
            } else {
                errorResponse(404, "Post not found", res);
            }

        } else {
            errorResponse(422, err.message, res);
        }
    } catch (err) {
        errorResponse(422, err.message, res);
    }
}



exports.update = async (req, res) => {
    try {
        let user = await User.findOne({ _id: req.userdata.id })
        if (req.userdata.id === user.id) {
            const schema = Joi.object({
                title: Joi.string().required(),
                content: Joi.string().required(),
                photos: Joi.array().items(Joi.string())
            });

            const { error } = schema.validate(req.body);
            if (error) {
                return errorResponse(422, error.message, res);
            }
            await Post.updateOne({ _id: req.params.id }, req.body)
                .then((docs) => {
                    successResponse(200, "post updated successfully", docs, res)
                })
                .catch((err) => {
                    errorResponse(422, err.message, res)
                });
        } else {
            errorResponse(422, err.message, res)
        }
    }
    catch (err) {
        errorResponse(422, err.message, res);
    }
};


exports.destroy = async (req, res) => {
    try {
        let user = await User.findOne({ _id: req.userdata.id })
        if (req.userdata.id === user.id) {
            Post.deleteOne({ _id: req.params.id }).then(() => {
                successResponse(200, "user deleted", {}, res)
            }).catch((err) => {
                errorResponse(422, err.message, res);
            })
        } else {
            errorResponse(422, err.message, res);
        }
    } catch (err) {
        errorResponse(422, err.message, res);
    }
}
