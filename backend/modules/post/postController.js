const responseUtils = require("utils/responseUtils")
const postService = require("./postService.js");
const { validationResult } = require("express-validator");
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
            const title = req.query.title || null;
            // const cat = parse Int(req.query.cat);

            const post = await postService.list(page, limit, categoryId, tagId, userId, langId, status, featured, title);
            // xử lý show all ở đây
            return responseUtils.ok(res, post)
        } catch (error) {
            console.log(error)
            return responseUtils.error(res, { message: error })
        }
    },
    getbyId: async (req, res) => {
        try {
            const id = req.params.id ? parseInt(req.params.id) : null;

            if (!id) {
                return responseUtils.error(res, "ID chưa được truyền ")
            }
            const post = await postService.getbyId(id);
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
            // Kiểm tra validate trước khi xử lý
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return responseUtils.invalidated(res, errors.array());
            }
            // Lấy dữ liệu từ request
            const { title, thumbnail, featured, status, content, category, user_id, tags, lang_id } = req.body;
            if (!title) {
                return responseUtils.invalidated(res, 'validation.title.required');
            }
            if (!content) {
                return responseUtils.invalidated(res, 'validation.content.required');
            }
            if (!category) {
                return responseUtils.invalidated(res, 'validation.category.required');
            }
            if (!user_id) {
                return responseUtils.invalidated(res, 'validation.user_id.required');
            }
            const newPost = await postService.createPost({
                title,
                slug: title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
                thumbnail: thumbnail || null,
                featured: featured || false,
                status: status || "draft",
                lang_id: lang_id || "1",
                content,
                category: Array.isArray(category) ? category : [],
                user_id,
                tags: Array.isArray(tags) ? tags : [],
                created_at: new Date(),
                updated_at: new Date(),
            });
            return responseUtils.ok(res, newPost);
        } catch (error) {
            console.log(error)
            return responseUtils.error(res, error)
        }
    },
    // chỉnh sửa bài viết
    edit: async (req, res) => {
        // Kiểm tra validate trước khi xử lý
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return responseUtils.invalidated(res, errors.array());
        }
        // Lấy dữ liệu từ request
        const id = req.params.id;
        const { title, thumbnail, content, category, tags, lang_id } = req.body;

        const checkPost = await postService.getbyId(id);
        if (!checkPost) {
            return responseUtils.notFound(res, "ID không tồn tại")
        }
        // Danh sách field cho phép update
        const allowedFields = ['title', 'featured', 'status', 'lang_id', 'thumbnail', 'content', 'category', 'tags'];
        // Chỉ giữ field hợp lệ và có giá trị
        const filteredBody = Object.fromEntries(
            Object.entries(req.body).filter(([k, v]) => allowedFields.includes(k) && v !== undefined)
        );
        console.log(filteredBody);
        //  Kiểm tra field không hợp lệ
        const invalidFields = Object.keys(req.body).filter(key => !allowedFields.includes(key));
        console.log(invalidFields);
        if (invalidFields.length > 0) {
            return responseUtils.invalidated(res, "validation.requỉed");
        }

        const updateData = {};

        if (filteredBody.title !== undefined) {
            updateData.title = filteredBody.title;
            updateData.slug = filteredBody.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        }

        if (filteredBody.thumbnail !== undefined) updateData.thumbnail = filteredBody.thumbnail;
        if (filteredBody.content !== undefined) updateData.content = filteredBody.content;
        if (filteredBody.lang_id !== undefined) updateData.lang_id = filteredBody.lang_id;
        if (filteredBody.category !== undefined) updateData.category = filteredBody.category;
        if (filteredBody.tags !== undefined) updateData.tags = filteredBody.tags;
        if (filteredBody.featured !== undefined) updateData.featured = filteredBody.featured;
        if (filteredBody.status !== undefined) updateData.status = filteredBody.status;

        const updatedPost = await postService.update(id, updateData);

        return responseUtils.ok(res, {
            message: "Cập nhật bài viết thành công",
            post: updatedPost
        });
    },
    delete: async (req, res) => {
        const postId = req.params.id;
        if (!postId) {
            return responseUtils.error(res, "chưa truyền ID")
        }
        const checkPost = await postService.getbyId(postId);
        if (!checkPost) {
            return responseUtils.notFound(res, "ID không tồn tại")
        }

        await postService.delete(postId);
        return responseUtils.ok(res, {
            message: "Xóa bài viết thành công"
        });
    }

}

module.exports = postController