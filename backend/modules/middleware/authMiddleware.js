const jwtUtils = require("../../utils/jwtUtils");
const responseUtils = require("../../utils/responseUtils");

const authMiddleware = (req, res, next) => {
        try {
            const access_token = req.headers.authorization.split(" ")[1];
            const decoded = jwtUtils.verify(access_token);
            if (!decoded) {
                return responseUtils.error(res, "Unauthorized");
            }
            req.user = decoded;
            next();
        } catch (error) {
            return responseUtils.error(res, "Unauthorized");
        }
}

module.exports = authMiddleware;