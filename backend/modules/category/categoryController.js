const responseUtils = require("utils/responseUtils")
const categoryService = require("./categoryService.js");
const { validationResult } = require("express-validator");

const categoryController = {
    all: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || parseInt(process.env.CATEGORY_PAGINATION_LIMIT);

            const categories = await categoryService.list(page,limit);
            if (!categories.rows || categories.rows.length === 0 ) {
                return responseUtils.notFound(res, "Không có category nào");
            }   
            return responseUtils.ok(res,categories)
        } catch (error) {
            console.error(error);
            responseUtils.error(res, error);
        }
    },

    getbyId : async (req,res) => {
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

    create: async(req, res) => {
        try {

            const { name, description, thumbnail } = req.body;

            const category = await categoryService.create({
                thumbnail: thumbnail || 'img/default-category.png',
                cat_name: name,
                cat_slug : name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
                description : description,
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
            const id = parseInt(req.params.id) || null;
            // check validation errors truoc khi xu ly
            const checkid = await categoryService.getbyId(id);
            if (!checkid) {
                return responseUtils.notFound(res, "Không tìm thấy category");
            }
            const data = req.body;
            const cat_slug = data.slug || data.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
            const updatedata = {
                cat_name: data.name,
                description: data.description,
                cat_slug: cat_slug,
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
            return responseUtils.ok(res, category);
        } catch (error) {
            console.log(error);
            return responseUtils.error(res, "Lỗi server");
        }
    },

}

module.exports = categoryController