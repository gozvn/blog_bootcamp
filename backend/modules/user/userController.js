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
    create: async (req, res) => {
        try {
            const userData = req.body;
            const newUser = await userSerivce.create(userData);
            return responseUtils.ok(res, newUser);
        } catch (error) {
            console.error(error);
            responseUtils.error(res, error);
        }
    },
    update: async (req, res) => {
        try {
            const userId = parseInt(req.params.id);
            const userData = req.body;
            const updatedUser = await userSerivce.update(userId, userData);
            return responseUtils.ok(res, updatedUser);
        } catch (error) {
            console.error(error);
            responseUtils.error(res, error);
        }
    },
    delete: async (req, res) => {
        try {
            const userId = parseInt(req.params.id);
            if (!userId) {
                responseUtils.error(res, "Không có user hợp lệ !");
            }
            await userSerivce.delete(userId);
            return responseUtils.ok(res, { message: "Xóa thành công" });
        } catch (error) {
            console.error(error);
            responseUtils.error(res, error);
        }
    },
}

module.exports = userController