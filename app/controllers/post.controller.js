const {Post} = require('../models/index.modal')
const { errorResponse, successResponse } = require('../helpers/response')


exports.create =  (req, res) => {
    try {
        let author = req.userdata.id
         new Post(req.body, author).save().then((docs) => {
            successResponse(201, "Post created.", docs, res)
        }).catch((err) => {
            errorResponse(422,err.message,res)
        })
    } catch (err) {
        errorResponse(422,err.message,res)
    }
}   


exports.index = async (req, res) => {
    try {
        await Post.find().then((docs) => {
            res.status(200).json({
                message: "post retrieved successfully",
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
        await  Post.findOne({_id: req.params.id}).populate("author").then((docs) => {
            res.status(200).json({
                message: "post retrieved successfully",
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
        await Post.updateOne({_id: req.params.id},req.body).then((docs) => {
            res.status(200).json({
                message: "post updated successfully",
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
        res.status(422).json({
            message: "abcd",
            status: false
        })
    }
}   


exports.destroy = async (req, res) => {
    try {
        await Post.deleteOne({_id: req.params.id}).then(() => {
            res.status(200).json({
                message: "post deleted",
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
;