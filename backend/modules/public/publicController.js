const publicService = require("./pubclicService");
const responseUtils = require("utils/responseUtils");

const publicController = {
    getCategories: async (req, res) => {
        // Logic to get categories
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || parseInt(process.env.CATEGORY_PAGINATION_LIMIT);

            const categories = await publicService.listCategories(page,limit);
            if (!categories.rows || categories.rows.length === 0 ) {
                return responseUtils.notFound(res, "Không có category nào");
            }   
            return responseUtils.ok(res,categories)
        } catch (error) {
            console.error(error);
            responseUtils.error(res, error);
        }
    },
    getTags: async (req, res) => {
        // Logic to get tags
    },
    getLanguages: async (req, res) => {
        // Logic to get languages
    },
    getPosts: async (req, res) => {
        // Logic to get posts
    },
    getUsers: async (req, res) => {
        // Logic to get users
    },
};

module.exports = publicController