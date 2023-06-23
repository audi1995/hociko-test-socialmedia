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
            let page = req.query.page ? parseInt(req.query.page) : 1;
            let limit = req.query.limit ? parseInt(req.query.limit) : 5;
            let skip = page > 1 ? (page - 1) * limit : 0;

            const comments = await Comment.find().skip(skip).limit(limit);
            successResponse(200, "Comments retrieved successfully", comments, res)
        }
    catch (err) {
        errorResponse(422, err.message, res);
    }}


exports.show = async (req, res) => {
    try {
        const post = await Post.findOne({ _id: req.params.post })
        if (req.userdata.id === post.user && req.params.post === post.id) {

            Comment.findOne({ _id: req.params.id }).populate('user').populate('post').then((docs) => {
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

        const post = await Post.findOne({ _id: req.params.post });

        if (req.userdata.id === post.user && req.params.post === post.id) {
            Comment.updateOne({ _id: req.params.id }, req.body).then((docs) => {
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
        Comment.deleteOne({ _id: req.params.id }).then(() => {
            successResponse(200, "comment deleted", {}, res);
        }).catch((err) => {

            errorResponse(422, err.message, res);
        })
    } catch (err) {
        errorResponse(422, err.message, res);
    }
}   
