const responseUtils = require("utils/responseUtils")
const categoryService = require("./categoryService.js");
const { validationResult } = require("express-validator");


const categoryController = {
    all: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || parseInt(process.env.CATEGORY_PAGINATION_LIMIT);

            const categories = await categoryService.list(page, limit);
            if (!categories.rows || categories.rows.length === 0) {
                return responseUtils.notFound(res, "Không có category nào");
            }
            return responseUtils.ok(res, categories)
        } catch (error) {
            console.error(error);
            responseUtils.error(res, error);
        }
    },

    getbyId: async (req, res) => {
        try {
            // const cat_id = req.query.cat_id ? parseInt(req.query.cat_id) : null;
            const cat_id = req.params.id ? parseInt(req.params.id) : null;

            if (!cat_id) {
                return responseUtils.error(res, "Thiếu tham số cat_id");
            }

            const category = await categoryService.getbyId(cat_id);

            if (!category) {
                return responseUtils.notFound(res, "Không tìm thấy category");
            }

            return responseUtils.ok(res, category);
        } catch (error) {
            console.log(error);
            return responseUtils.error(res, "Lỗi server");
        }
    },

    create: async (req, res) => {
        try {
            // Kiểm tra validate trước khi xử lý
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return responseUtils.invalidated(res, errors.array());
            }
            // Lấy dữ liệu từ request
            const { name, description, thumbnail, slug } = req.body;

            // Tạo slug từ name nếu không có slug được cung cấp
            const generatedSlug = slug || name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

            const category = await categoryService.create({
                thumbnail: thumbnail || 'assets/img/no-img.jpg',
                name: name,
                slug: generatedSlug,
                description: description,
                created_at: new Date(),
                updated_at: new Date()
            });

            return responseUtils.ok(res, category);

        } catch (error) {
            console.log(error);
            return responseUtils.error(res, "Lỗi server");
        }
    },

    update: async (req, res) => {
        try {
            // Kiểm tra validate input từ express-validator
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return responseUtils.invalidated(res, errors.array());
            }

            // Lấy id và check category tồn tại
            const id = parseInt(req.params.id);
            const categoryExist = await categoryService.getbyId(id);
            if (!categoryExist) {
                return responseUtils.notFound(res, "Không tìm thấy category");
            }

            const data = req.body;
            if (!data || Object.keys(data).length === 0) {
                return responseUtils.error(res, "Dữ liệu cập nhật không hợp lệ");
            }

            // Xử lý dữ liệu cập nhật
            const updateData = {};

            if (data.name) {
                updateData.name = data.name;
                updateData.slug =
                    data.slug ||
                    data.name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
            }

            if (data.slug) {
                updateData.slug = data.slug.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
            }
            if (data.description !== undefined) {
                updateData.description = data.description;
            }

            updateData.updated_at = new Date();

            const updated = await categoryService.update(id, updateData);
            return responseUtils.ok(res, updated);

        } catch (error) {
            console.log(error);
            return responseUtils.error(res, "Lỗi server");
        }
    },

    delete: async (req, res) => {
        try {
            const cat_id = req.params.id ? parseInt(req.params.id) : null;
            if (!cat_id) {
                return responseUtils.error(res, "Thiếu tham số cat_id");
            }
            const checkid = await categoryService.getbyId(cat_id);
            if (!checkid) {
                return responseUtils.notFound(res, "Không tìm thấy category");
            }
            const category = categoryService.delete(cat_id);
            return responseUtils.ok(res, "ok");
        } catch (error) {
            console.log(error);
            return responseUtils.error(res, "Lỗi server");
        }
    },

}

module.exports = categoryController