const responseUtils = require("utils/responseUtils")

const userController = {
    exampleRequest: (req, res) => {
        return responseUtils.ok(res, {
            data: 'THiS MES'
        })
    }
}

module.exports = userController