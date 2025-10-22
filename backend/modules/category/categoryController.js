const responseUtils = require("utils/responseUtils")
const categoryService = require("./categoryService.js");
const { validationResult } = require("express-validator");

const categoryController = {
    all: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const categoryId = req.query.cat_id || null;

            const cat = await categoryService.list(page,limit,categoryId);
            return responseUtils.ok(res,cat)
        } catch (error) {
            console.error(error);
            responseUtils.error(res, error);
        }
    },

    getbyID : async (req,res) => {
        try {
            // const cat_id = req.query.cat_id ? parseInt(req.query.cat_id) : null;
            const cat_id = req.params.id ? parseInt(req.params.id) : null;

            if (!cat_id) {
                return responseUtils.error(res, "Thiếu tham số cat_id");
            }

            const category = await categoryService.getbyID(cat_id);

            if (!category) {
                return responseUtils.notFound(res, "Không tìm thấy category");
            }

            return responseUtils.ok(res, category);
        } catch (error) {
            console.log(error);
            return responseUtils.error(res, "Lỗi server");
        }
    },

    create: async(req, res) => {
        try {
            // check validation errors truoc khi xu ly
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return responseUtils.error(res, errors.array());
            }

            const { name, description, thumbnail } = req.body;

            const category = await categoryService.create({
                thumbnail: thumbnail || 'img/default-category.png',
                cat_name: name || "Unnamed Category",
                cat_slug : cat_name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
                description
            });
            
            return responseUtils.ok(res, category);

        } catch (error) {
            console.log(error);
            return responseUtils.error(res, "Lỗi server");
        }   
    },

    update: async (req, res) => {
        try {
            const id = parseInt(req.params.id) || null;
            // check validation errors truoc khi xu ly
            const checkid = await categoryService.getbyID(id);
            if (!checkid) {
                return responseUtils.notFound(res, "Không tìm thấy category");
            }
            const data = req.body;
            const updatedata = {
                cat_name: data.cat_name,
                description: data.description,
                cat_slug: data.cat_name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
                updated_at: new Date()
            }

            if (!data || Object.keys(data).length === 0 ) {
                return responseUtils.error(res, "Dữ liệu cập nhật không hợp lệ");
            }
            const category = await categoryService.update(id, updatedata);

            return responseUtils.ok(res, category);
            
        } catch (error) {
            console.log(error);
            return responseUtils.error(res, "Lỗi server");
        }
    },

    delete: (req, res) => {
        try {
            const cat_id = req.params.id ? parseInt(req.params.id) : null;
            const category = categoryService.delete(cat_id);
            return responseUtils.ok(res, category);
        } catch (error) {
            console.log(error);
            return responseUtils.error(res, "Lỗi server");
        }
    },

}

module.exports = categoryController