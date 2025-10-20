const responseUtils = require("utils/responseUtils")
const categoryService = require("../categoryServices/categoryService.js")
    
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
    create: (req, res) => {
        // Implementation for creating a category
    }
}

module.exports = categoryController