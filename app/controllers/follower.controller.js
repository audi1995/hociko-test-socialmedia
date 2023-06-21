const { Follower, User } = require('../models/index.model')
const { errorResponse, successResponse } = require('../helpers/response')
const Joi = require("joi");


exports.create = async (req, res) => {
    try {
        console.log(req.userdata.id);
        console.log(req.body);
        new Follower({ ...req.body, user: req.userdata.id })
            .save()
            .then((docs) => {
                successResponse(201, "follower added", docs, res);
            })
            .catch((err) => {
                errorResponse(422, "follower not added", res);
            });
    } catch (err) {
        errorResponse(500, err.message, res);
    }
};

exports.index = async (req, res) => {
    try {
            let page = req.query.page ? parseInt(req.query.page) : 1;
            let limit = req.query.limit ? parseInt(req.query.limit) : 5;
            let skip = page > 1 ? (page - 1) * limit : 0;

                let follow =await Follower.findOne({ user: req.userdata.id})
                console.log(follow);

    } catch (err) {
        errorResponse(422, err.message, res)
    }

}


exports.update = async (req, res) => {

}

exports.destroy = async (req, res) => {

}
