const responseUtils = require("utils/responseUtils")
const userSerivce = require("./userService.js");

const userController = {
    all: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || parseInt(process.env.CATEGORY_PAGINATION_LIMIT);

            const user = await userSerivce.list(page,limit);

            return responseUtils.ok(res,user)

        } catch (error) {
            console.error(error);
            responseUtils.error(res, error);
        }
    },
    getbyUser: (req, res) => {
        return responseUtils.ok(res, {
            data: 'GET POSTS BY USER'
        })
    },
    create: (req, res) => {
        return responseUtils.ok(res, {
            data: 'CREATE USER'
        })
    },
    getbyID: (req, res) => {
        return responseUtils.ok(res, {
            data: 'GET BY ID USER'
        })
    },
    update: (req, res) => {
        return responseUtils.ok(res, {
            data: 'UPDATE USER'
        })
    },
    delete: (req, res) => {
        return responseUtils.ok(res, {
            data: 'DELETE USER'
        })
    }
}

module.exports = userController