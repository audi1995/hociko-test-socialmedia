const { successResponse, errorResponse } = require('../helpers/response')
const { Like, User, Post, Comment } = require('../models/index.model')


exports.create = async (req, res) => {
    try {
        const post = await Post.findOne({ _id: req.params.post })
        if (req.userdata.id === post.user && req.params.post === post.id) {
             new Like({...req.body, post: post.id, user: post.user }).save().then((docs) => {
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
            let page = req.query.page ? parseInt(req.query.page) : 1;
            let limit = req.query.limit ? parseInt(req.query.limit) : 5;
            let skip = page > 1 ? (page - 1) * limit : 0;

                Like.find().skip(skip).limit(limit).then((docs) => {
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

exports.show = async (req, res) => {
    try {
        const post = await Post.findOne({ _id: req.params.post })
        if (req.userdata.id === post.user && req.params.post === post.id) {
             Like.findOne({ _id: req.params.id }).populate("post").populate('user').then((docs) => {
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
             Like.updateOne({ _id: req.params.id }, req.body).then((docs) => {
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
             Like.deleteOne({ _id: req.params.id }).then(() => {
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
