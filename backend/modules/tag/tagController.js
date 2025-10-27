const responseUtils = require("utils/responseUtils");
const tagService = require("./tagService");

const tagController = {
    all: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || process.env.TAG_PAGINATION_LIMIT;
            const id = req.query.id ? parseInt(req.query.id) : null;

            const tags = await tagService.list(page, limit, id);
            if (!tags.rows || tags.rows.length === 0) {
                return responseUtils.notFound(res, "Không có tag nào");
            }
            return responseUtils.ok(res, tags);
        } catch (error) {
            console.error(error);
            return responseUtils.error(res, error);
        }
    },

    create: async (req, res) => {
        try {
            const { name } = req.body;
            
            if ( !name ) {
                return responseUtils.error(res, " Chưa truyền dữ liệu ")
            }

            const tag = await tagService.create({
                name: name,
                slug: name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]+/g, ""),
                created_at: new Date(),
                updated_at: new Date(),
            });

            return responseUtils.ok(res, tag);
        } catch (error) {
            console.error(error);
            return responseUtils.error(res, "Lỗi server");
        }
    },

    update: async (req, res) => {
        try {
            const id = parseInt(req.params.id) || null;
            // Check xem tag ton tai truoc roi moi xu ly
            const checkid = await tagService.getbyID(id);
            // Lấy name từ body đúng cách
            if (!checkid) {
                return responseUtils.notFound(res, "Không tìm thấy tag");
            }

            // Check name moi trong body 
            const { name } = req.body;
            if (!name) {
                return responseUtils.error(res, "Chưa truyền name");
            }

            const updatedata = {
                name:name,
                slug: name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]+/g, ""),
                updated_at: new Date(),
            };
            const tag = await tagService.update(id, updatedata);
            return responseUtils.ok(res, tag);
        } catch (error) {
            console.error(error);
            return responseUtils.error(res, "Lỗi server");
        }
    },

    delete: async (req, res) => {
        try {
            const tag_id = req.params.id ? parseInt(req.params.id) : null;
            if (!tag_id) {
                return responseUtils.error(res, "Thiếu tham số id");
            }
            const checkid = await tagService.getbyID(tag_id);
            if (!checkid) {
                return responseUtils.notFound(res, "Không tìm thấy tag");
            }
            const tag = await tagService.delete(tag_id);
            return responseUtils.ok(res, tag);
        } catch (error) {
            console.error(error);
            return responseUtils.error(res, "Lỗi server");
        }
    },
};

module.exports = tagController;