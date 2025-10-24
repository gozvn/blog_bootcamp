const responseUtils = require("utils/responseUtils")
const postService = require("./postService.js");

const postController = {
    
    all: async (req, res) => {
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

            const post = await postService.list(page,limit,categoryId,tagId,userId,langId,status,featured);
            // xử lý show all ở đây
            return responseUtils.ok(res,post)
        } catch (error) {
            console.log(error)
            return responseUtils.error(res,{ message : error })
        }
    },
    getbyID : async (req, res) => {
        try {
            const id = req.params.id ? parseInt(req.params.id) : null;

            if (!id) {
                return responseUtils.error(res, "ID chưa được truyền ")
            }
            const post = await postService.getbyID(id);
            if (!post) {
                return responseUtils.notFound(res, " ID Không tồn tại ")
            }
            return responseUtils.ok(res, post);

        } catch (error) {
            console.log(error)
            return responseUtils.error(res, error)
        }
    },
    // tạo bài viết mới
    create: async (req, res) => {
        try {
            const { title, thumbnail, featured, status, content, category, user_id, tag_id } = req.body;
            if (!title || !content) {
                return responseUtils.badRequest(res, {
                    error: 'Thiếu tiêu đề hoặc nội dung bài viết'
                });
            }
            const newPost = await postService.createPost({
                title,
                title_slug: title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
                thumbnail: thumbnail || 'img/default-thumbnail.jpg',
                featured: featured || "0",
                status: status || "draft",
                content,
                category,
                user_id,
                tag_id: Array.isArray(tag_id) ? tag_id : []
            });
            return responseUtils.ok(res, {
                message: 'Tạo bài viết thành công',
                post: newPost
            });
        } catch (error) {
            console.log(error)
            return responseUtils.error(res, error)
        }
    },
    // chỉnh sửa bài viết
    edit: async(req, res) => { 
        // const postId = req.params.id;
        // const { title, content, category, tag_id } = req.body;
        // if (!title || !content) {
    },
    delete: async(req, res) => {
        // const postId = req.params.id;
    }

}

module.exports = postController