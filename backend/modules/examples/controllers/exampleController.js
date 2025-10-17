const responseUtils = require("utils/responseUtils")

const exampleController = {
    exampleRequest: (req, res) => {
        return responseUtils.ok(res, {
            data: 'THiS MES'
        })
    }
}

module.exports = exampleController