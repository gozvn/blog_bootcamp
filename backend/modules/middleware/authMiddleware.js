const jwtUtils = require("../../utils/jwtUtils");
const responseUtils = require("../../utils/responseUtils");

const authMiddleware = (req, res, next) => {
    try {
        const access_token = req.headers.authorization.split(" ")[1];
        const decoded = jwtUtils.verify(access_token);
        if (!decoded) {
            w
            return responseUtils.unauthorized(res, "Unauthorized");
        }
        req.user = decoded;
        // console.log(req.user)
        next();
    } catch (error) {
        return responseUtils.unauthorized(res, "Unauthorized");
    }
}

const checkRole = (role) => {
    return (req, res, next) => {
        if (parseInt(req.user.role) > parseInt(role)) {
            return responseUtils.unauthorized(res, "Unauthorized");
        }
        next();
    }
}

const canUpdateUser = (req, res, next) => {
    const currentUser = req.user;
    const targetUserId = Number(req.params.id);

    // Admin / Super Admin
    if (parseInt(currentUser.role) <= 1) {
        return next();
    }

    // User thường → chỉ update chính mình
    if (parseInt(currentUser.role) > 3 && currentUser.id === targetUserId) {
        return next();
    }

    return responseUtils.unauthorized(res, "Unauthorized");
};

module.exports = { authMiddleware, checkRole, canUpdateUser };