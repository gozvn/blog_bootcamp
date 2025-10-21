const responseUtils = require("utils/responseUtils")
const postService = require("./postService.js");

const postController = {
    all: async (req, res) => {
        try {
            // chenf param ở đây
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
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
            return responseUtils.error(res,{
                message : error
            })
        }
    },
    getbyID : async (req, res) => {
        try {
            const id = req.query.id ? parseInt(req.query.id) : null;
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
    createPost: (req, res) => {
        // // Dữ liệu gửi lên nằm ở req.body
        // const { title, content, category, user_id,tag_id } = req.body;
        // if (!title || !content) {
        //     return responseUtils.badRequest(res, {
        //         error: 'Thiếu tiêu đề hoặc nội dung bài viết'
        //     });
        // }
        // // Trả về dữ liệu mẫu
        // return responseUtils.ok(res, {
        //     message: 'Tạo bài viết thành công',
        //     post: { title, content }
        // });
    }


}

module.exports = postController