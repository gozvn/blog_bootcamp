const responseUtils = require("utils/responseUtils")
const postService = require("../postServices/postService.js")

const postController = {

    postRequest: async (req, res) => {
        try {
            const post = await postService.list();
            // xử lý show all ở đây
            return responseUtils.ok(res,{post})
        } catch (error) {
            console.log(error)
            return responseUtils.error(res,{
                message : error
            })
        }
    },
    postDetail : (req, res) => {

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