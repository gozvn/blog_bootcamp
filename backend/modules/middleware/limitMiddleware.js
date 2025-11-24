const rateLimit = require("express-rate-limit");
const responseUtils = require("utils/responseUtils");

const limitPublic = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10000,
    handler: (req, res) => {
        // handler này được gọi khi vượt quá rate limit
        return responseUtils.invalidated(res, {
            status: 429,
            message: "Too many requests from this IP, please try again later."
        });
    }
});

const limitPrivate = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10000,
    handler: (req, res) => {
        return responseUtils.invalidated(res, {
            status: 429,
            message: "Too many private API requests, slow down!"
        });
    }
});

const limitUpload = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    handler: (req, res) => {
        return responseUtils.invalidated(res, {
            status: 429,
            message: "Too many upload requests, please wait."
        });
    }
});

const limitLogin = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    handler: (req, res) => {
        return responseUtils.invalidated(res, {
            status: 429,
            message: "Too many login attempts, please try again later."
        });
    }
});

const limitRegister = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    handler: (req, res) => {
        return responseUtils.invalidated(res, {
            status: 429,
            message: "Too many registration attempts, slow down."
        });
    }
});

module.exports = {
    limitPublic,
    limitPrivate,
    limitUpload,
    limitLogin,
    limitRegister
};