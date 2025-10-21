const responseUtils = require("utils/responseUtils")
const categoryService = require("./categoryService.js")
    
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
            const cat_id = req.query.cat_id ? parseInt(req.query.cat_id) : null;

            if (!cat_id){
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

    create: (req, res) => {
        try {
            const data = req.body;
            const category = categoryService.create(data);
            return responseUtils.ok(res, category);
        } catch (error) {
            console.log(error);
            return responseUtils.error(res, "Lỗi server");
        }   
    },
    update: (req, res) => {
        try {
            const cat_id = req.params.cat_id ? parseInt(req.params.cat_id) : null;
            const data = req.body;
            const category = categoryService.update(cat_id, data);
            return responseUtils.ok(res, category);
        } catch (error) {
            console.log(error);
            return responseUtils.error(res, "Lỗi server");
        }
    },
    delete: (req, res) => {
        try {
            const cat_id = req.params.cat_id ? parseInt(req.params.cat_id) : null;
            const category = categoryService.delete(cat_id);
            return responseUtils.ok(res, category);
        } catch (error) {
            console.log(error);
            return responseUtils.error(res, "Lỗi server");
        }
    },
    
}

module.exports = categoryController