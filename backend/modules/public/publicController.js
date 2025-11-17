const { get } = require("index");
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
    getPosts: async (req, res) => {
        try {
            // chenf param ở đây
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || process.env.POST_PAGINATION_LIMIT;
            const categoryId = req.query.category_id || null;
            const tagId = req.query.tag_id || null;
            const userId = req.query.user_id || null;
            const langId = req.query.lang_id || null;
            const status = req.query.status || null;
            const featured = req.query.featured || null;
            // const cat = parse Int(req.query.cat);

            const post = await publicService.listPosts(page,limit,categoryId,tagId,userId,langId,status,featured);
            // xử lý show all ở đây
            return responseUtils.ok(res,post)
        } catch (error) {
            console.log(error)
            return responseUtils.error(res,{ message : error })
        }
    },
    getPostById: async (req, res) => {
        try {
            const postId = parseInt(req.params.id)  || null;
            const post = await publicService.getPostById(postId);
            if (!post) {
                return responseUtils.notFound(res, "Không tìm thấy bài viết");
            }
            return responseUtils.ok(res,post)
        } catch (error) {
            console.log(error)
            return responseUtils.error(res,{ message : error })
        }
    },
    getCategoryById: async (req, res) => {
        try {
            const categoryId = parseInt(req.params.id)  || null;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || parseInt(process.env.CATEGORY_PAGINATION_LIMIT) || 10;
            const category = await publicService.getCategoryById(categoryId,page,limit);
            if (!category) {
                return responseUtils.notFound(res, "Không tìm thấy danh mục");
            }
            return responseUtils.ok(res,category)
        } catch (error) {
            console.log(error)
            return responseUtils.error(res,{ message : error })
        }
    },
    getCommentsByPostId: async (req, res) => {
        try {
            const postId = parseInt(req.params.id)  || null;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || parseInt(process.env.COMMENT_PAGINATION_LIMIT) || 10;
            const comments = await publicService.getCommentsByPostId(postId,page,limit);

            if (!comments || comments.length === 0) {
                return responseUtils.notFound(res, "Bài viết chưa có bình luận nào");
            }
            return responseUtils.ok(res,comments)
        } catch (error) {
            console.log(error)
            return responseUtils.error(res, error)
        }
    }
};

module.exports = publicController