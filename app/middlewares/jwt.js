var jwt = require('jsonwebtoken');
const { User } = require("../models/index.model");
const { errorResponse } = require('../helpers/response');
const secret = process.env.SECRET;

exports.generateWebToken = (docId) => {
    return jwt.sign({
        data: docId,
    }, secret, { expiresIn: 60 * 60 * 24 * 7 });
}

exports.verifyWebToken = async (req, res, next) => {
    if (!req.headers.authorization) {
        errorResponse(401, "Authentication failed", res)
    } else {
        let token = req.headers.authorization.split(" ")[1];
        try {
            const decoded = jwt.verify(token, secret);
            const user = await User.findOne({ _id: decoded.data });

            if (user) {
                req.userdata = user;
                next();
            } else {
                res.status(401).json({
                    message: "Authentication failed",
                    status: false
                });
            }
        } catch (err) {
            console.log("auth token error", err);
            res.status(401).json({
                message: "Authentication failed",
                status: false
            });
        }
    }
};

