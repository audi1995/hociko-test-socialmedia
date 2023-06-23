const { ObjectId } = require('mongodb');
const { successResponse, errorResponse } = require('../helpers/response')
const { Like, User, Post, Comment } = require('../models/index.model');
const { Types } = require('mongoose');


exports.create = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.userdata.id });
        const post = await Post.findOne({ _id: req.params.post });

        if (req.userdata.id === user.id && req.params.post === post.id) {
            let likes = await Like.find({ post: post.id, user: user.id });
            if (likes.length > 0) {
                errorResponse(422, "Already liked", res);
            } else {
                new Like({ ...req.body, post: post.id, user: user.id })
                    .save()
                    .then((docs) => {
                        successResponse(201, "Like created", docs, res);
                    })
                    .catch((err) => {
                        errorResponse(422, err.message, res);
                    });
            }
        } else {
            errorResponse(422, "Invalid user or post", res);
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
        const likes = await Like.find({ post: req.params.post })
            .skip(skip)
            .limit(limit);

        successResponse(200, "Likes retrieved successfully", likes, res);
    } catch (err) {
        errorResponse(422, err.message, res);
    }
};


exports.show = async (req, res) => {
    try {
        const post = await Post.findOne({ _id: req.params.post });
        const author = await User.findOne({ _id: post.author });
        if (req.userdata.id === author.id && req.params.post === post.id) {
            const result = await Like.aggregate([
                { $match: { like: true, post: new Types.ObjectId(req.params.post) } },
                {
                    $lookup: {
                        from: "users",
                        localField: "user",
                        foreignField: "_id",
                        as: "user"
                    }
                },
                {
                    $group: {
                        _id: "$post",
                        count: { $sum: 1 },
                        likes: { $push: "$$ROOT" }
                    }
                },
                {
                    $lookup: {
                        from: "posts",
                        localField: "_id",
                        foreignField: "_id",
                        as: "post"
                    }
                },
                { $unwind: "$post" },
                {
                    $lookup: {
                        from: "users",
                        localField: "post.author",
                        foreignField: "_id",
                        as: "author"
                    }
                },
                { $unwind: "$author" },
                {
                    $project: {
                        _id: 0,
                        count: 1,
                        likes: 1,
                        post: 1,
                        author: 1
                    }
                }
            ]);
            successResponse(200, "likes retrieved successfully", result, res);
        } else {
            errorResponse(422, "Unauthorized", res);
        }
    } catch (err) {
        errorResponse(422, err.message, res);
    }
};


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
