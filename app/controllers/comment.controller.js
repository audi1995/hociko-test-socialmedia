const {Comment, Post, User} = require('../models/comment.model')
const { errorResponse, successResponse } = require('../helpers/response')
const Joi = require("joi");

exports.create = async (req, res) => {
    try {
        await new Comment(req.body).save().then((docs) => {
            res.status(201).json({
                message: "comment created",
                data: docs,
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


exports.index = async (req, res) => {
    try {
        await Comment.find().then((docs) => {
            res.status(200).json({
                message: "comment retrieved successfully",
                data: docs,
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

exports.show = async (req, res) => {
    try {
        await Comment.findOne({ _id: req.params.id }).populate('user').populate('post').then((docs) => {
            res.status(200).json({
                message: "comment retrieved successfully",
                data: docs,
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


exports.update = async (req, res) => {
    try {
        console.log(req.body);
        await Comment.updateOne({ _id: req.params.id }, ...req.body).then((docs) => {
            res.status(200).json({
                message: "comment updated successfully",
                data: docs,
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


exports.destroy = async (req, res) => {
    try {
        console.log(req.body);
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
