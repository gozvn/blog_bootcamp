const responseUtils = require("utils/responseUtils")
const userSerivce = require("./userService.js");

const userController = {
    all: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || parseInt(process.env.CATEGORY_PAGINATION_LIMIT);
            const id = req.query.id || null;
            const role = req.query.role || null;
            const user = await userSerivce.list(page, limit, id,role);

            return responseUtils.ok(res,user)

        } catch (error) {
            console.error(error);
            responseUtils.error(res, error);
        }
    },
    getPost: async(req, res) => {
        try {
            const userId = parseInt(req.params.id) ;
            if (!userId) {
                responseUtils.error(res,"Không có usẻ hợp lệ !")
            }

            const user = await userSerivce.list(userId);

            return responseUtils.ok(res,user)

        } catch (error) {
          console.error(error)
          responseUtils.error(res,error)     
        }
    },
    create: (req, res) => {
        return responseUtils.ok(res, {
            data: 'CREATE USER'
        })
    },
    getbyId: async (req, res) => {
        try {
            const userId = parseInt(req.params.id) ;
            if (!userId) {
                responseUtils.error(res,"Không có user hợp lệ !")
            }
            const user = await userSerivce.list(userId);

            return responseUtils.ok(res,user)

        } catch (error) {
          console.error(error)
          responseUtils.error(res,error)
        }
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