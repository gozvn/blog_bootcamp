const responseUtils = require("utils/responseUtils");

const authController = {
    login : async (req, res) => {
        try {
            responseUtils.ok(res, "OK OK OK")
        } catch (error) {
            
        }
    }
}

module.exports = authController;