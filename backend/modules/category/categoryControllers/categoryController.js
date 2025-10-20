const responseUtils = require("utils/responseUtils")
const categoryService = require("../categoryServices/categoryService.js")
    
const categoryController = {
    async categoryRequest(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const categoryId = req.query.id || null;
            const userId = req.query.user_id || null;
            const langId = req.query.lang_id || null;

            const post = await categoryService.list(page,limit,categoryId,userId,langId);
            // xử lý show all ở đây
            return responseUtils.ok(res,post)
        } catch (error) {
            console.error("Error handling category request:", error);
            responseUtils.error(res, error);
        }
    }
}

module.exports = categoryController