const { Post, User, Comment } = require('../models/index.model')
const { errorResponse, successResponse } = require('../helpers/response')
const Joi = require("joi");

exports.create = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.userdata.id });
        const post = await Post.findOne({ _id: req.params.post })
        if (req.userdata.id === user.id && req.params.post === post.id) {
            new Comment({
                ...req.body,
                post: req.params.post,
                user: user.id
            })
                .save()
                .then((docs) => {
                    successResponse(201, "Comment created", docs, res)
                })
                .catch((err) => {
                    errorResponse(422, err.message, res)
                });
        } else {
            errorResponse(422, "Not authorized", res);
        }
    } catch (err) {
        errorResponse(422, err.message, res);
    }
};


exports.index = async (req, res) => {
    try {
        const post = await Post.findOne({ _id: req.params.post })
        if (req.userdata.id === post.user) {
            const comments = await Comment.find();
            successResponse(200, "Comments retrieved successfully", comments, res)
        }
        else {
            errorResponse(422, err.message, res);
        }
    } catch (err) {
        errorResponse(422, err.message, res);
    }
};


exports.show = async (req, res) => {
    try {
        const post = await Post.findOne({ _id: req.params.post })
        if (req.userdata.id === post.user && req.params.post === post.id) {

            await Comment.findOne({ _id: req.params.id }).populate('user').populate('post').then((docs) => {
                successResponse(200, "comment retrieved successfully", docs, res)
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



exports.update = async (req, res) => {
    try {
        const { error } = Joi.object({
            comment: Joi.string().required()
        }).validate(req.body);

        if (error) {
            errorResponse(422, error.message, res);
            return;
        }

        const user = await User.findOne({ _id: req.userdata.id });
        const post = await Post.findOne({ _id: req.params.post });

        if (req.userdata.id === post.user && req.params.post === post.id) {
            await Comment.updateOne({ _id: req.params.id }, req.body).then((docs) => {
                successResponse(202, "Comment updated successfully", docs, res);
            }).catch((err) => {
                errorResponse(422, err.message, res);
            });
        } else {
            errorResponse(422, "Not authorized", res);
        }
    } catch (err) {
        errorResponse(422, err.message, res);
    }
};



exports.destroy = async (req, res) => {
    try {
        await Comment.deleteOne({ _id: req.params.id }).then(() => {
            res.status(200).json({
                message: "comment deleted",
                data: {},
                status: true
            })
        }).catch((err) => {
            res.status(422).json({
                message: err.message,
                status: false
            })
        })
    } catch (err) {
        res.status(422).json(err)
    }
}   
