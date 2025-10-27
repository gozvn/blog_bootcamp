const responseUtils = require("utils/responseUtils");
const commentService = require("./commentService");
const { validationResult } = require("express-validator");

const commentController = {
    all: async (req, res) => {
        try {
            const id = parseInt(req.query.id) || null;
            const userId = parseInt(req.query.user_id) || null;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || parseInt(process.env.COMMENT_PAGINATION_LIMIT || 10);

            const comment = await commentService.list(page, limit, id, userId);
            return responseUtils.ok(res, comment);
        } catch (error) {
            console.error(error);
            return responseUtils.error(res, error);
        }
    },

    getById: async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            if (!id) {
                return responseUtils.error(res, " Chưa truyền ID");
            }

            const comment = await commentService.getById(id);
            if (!comment) {
                return responseUtils.notFound(res, " Không tồn tại Comment");
            }

            return responseUtils.ok(res, comment);
        } catch (error) {
            console.error(error);
            return responseUtils.error(res, error);
        }
    },

    create: async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return responseUtils.error(res, errors.array());
            }

            const { content, user_id, post_id } = req.body;
            
            if (!content || !user_id || !post_id) {
                return responseUtils.error(res, "Chưa truyền UserID, Content, Post ID");
            }

            const comment = await commentService.create({
                content,
                user_id,
                post_id
            });

            return responseUtils.ok(res, comment);
        } catch (error) {
            console.error(error);
            return responseUtils.error(res, error);
        }
    },

    update: async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            if (!id) {
                return responseUtils.error(res, "Chưa truyền Comment ID");
            }

            const comment = await commentService.getById(id);
            if (!comment) {
                return responseUtils.notFound(res, "Không tồn tại comment");
            }

            const { content } = req.body;
            if (!content) {
                return responseUtils.error(res, "Chưa truyền Content");
            }

            const updatedComment = await commentService.update(id, { content });
            return responseUtils.ok(res, "Đã sua thành công ");
        } catch (error) {
            console.error(error);
            return responseUtils.error(res, error);
        }
    },

    delete: async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            if (!id) {
                return responseUtils.error(res, "Chưa truyền ID");
            }

            const comment = await commentService.getById(id);
            if (!comment) {
                return responseUtils.notFound(res, "Không tồn tại comment nào ");
            }

            await commentService.delete(id);
            return responseUtils.ok(res, { message: "Xóa thành công" });
        } catch (error) {
            console.error(error);
            return responseUtils.error(res, error);
        }
    }
};

module.exports = commentController;