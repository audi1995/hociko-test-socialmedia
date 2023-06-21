
const { successResponse } = require('../helpers/response')
const { Like, User, Post, Comment } = require('../models/index.model')

exports.create = async (req, res) => {
    try {
        const post = await Post.findOne({ _id: req.params.post })
        if (req.userdata.id === post.user && req.params.post === post.id) {
            await new Like({...req.body, post: post.id, user: post.user }).save().then((docs) => {
                successResponse(201, "post created", docs, res)
            }).catch((err) => {
                errorResponse(422, err.message, res)
            })
        }
        else {
            errorResponse(422, err.message, res)
        }
    } catch (err) {
        errorResponse(422, err.message, res)
    }
}


exports.index = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.userdata.id });
        const post = await Post.findOne({ _id: req.params.post })
        if (req.userdata.id === post.user && req.params.post === post.id) {
            if (req.userdata.id === post.user) {
                Like.find().then((docs) => {
                    successResponse(201, "post retrieved successfully", docs, res)
                }).catch((err) => {
                    errorResponse(422, err.message, res)
                })
            }
            else {
                errorResponse(422, err.message, res)
            }
        } else {
            errorResponse(422, err.message, res)
        }
    } catch (err) {
        errorResponse(422, err.message, res)
    }
}

exports.show = async (req, res) => {
    try {
        const post = await Post.findOne({ _id: req.params.post })
        if (req.userdata.id === post.user && req.params.post === post.id) {

            await Like.findOne({ _id: req.params.id }).populate("post").populate('user').then((docs) => {
                successResponse(201, "post retrieved successfully", docs, res)
            }).catch((err) => {
                errorResponse(422, err.message, res)
            })
        } else {
            errorResponse(422, err.message, res)
        }
    } catch (err) {
        errorResponse(422, err.message, res)
    }
}


exports.update = async (req, res) => {
    try {
        const post = await Post.findOne({ _id: req.params.post })
        if (req.userdata.id === post.user && req.params.post === post.id) {

            await Like.updateOne({ _id: req.params.id }, req.body).then((docs) => {
                successResponse(201, "post updated successfully", docs, res)
            }).catch((err) => {
                errorResponse(422, err.message, res)
            })
        } else {
            errorResponse(422, err.message, res)
        }
    } catch (err) {
        errorResponse(422, err.message, res)
    }
}


exports.destroy = async (req, res) => {
    try {
        const post = await Post.findOne({ _id: req.params.post })
        if (req.userdata.id === post.user && req.params.post === post.id) {
            await Like.deleteOne({ _id: req.params.id }).then(() => {
                successResponse(200, "post deleted successfully", docs, res)
            }).catch((err) => {
                errorResponse(422, err.message, res)
            })
        } else {
            errorResponse(422, err.message, res)
        }
    } catch (err) {
        errorResponse(422, err.message, res)
    }
}   
