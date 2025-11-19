const { Post, User,Comment, Category, Tag, Language } = require("../../models");
const { validationResult } = require("express-validator");
const responseUtils = require("utils/responseUtils")

const postService = {
    async list(page = 1, limit = 10, categoryId = null, tagId = null, userId = null, langId = null, status = null, featured = null) {

            page = parseInt(page);
            limit = parseInt(limit);

            const offset = (page -1) * limit;
            const whereClause ={};
            const include = [
                    {
                        as : 'user',
                        model: User,
                        attributes: ["id", "username"],
                    },
                    {
                        as: 'categories',
                        model: Category,
                        attributes: ["id", "name"],
                        through: { attributes: [] },
                    },
                    {
                        as: 'tags',
                        model: Tag,
                        attributes: ["id","name"],
                        through : { attributes:[] }
                    },
                    {
                        as : 'language',
                        model: Language,
                        attributes: ["id","lang_name"],
                    }
            ];
            // loc ngôn ngữ
            if (langId){
                whereClause.lang_id = langId;
            }
            // loc trạng thái
            if (status){
                whereClause.status = status;
            }
            // loc nổi bật
            if (featured !== null){
                whereClause.featured = featured;
            }
            // loc user
            if (userId){
                include[0].where = { id : userId};
            }
            // Filter theo cat ID 
            if (categoryId) {
                include[1].where = { id: categoryId };
            }
            // Filer theo tag
            if (tagId) {
                include[2].where = { id: tagId };           
            }

            const { count, rows } = await Post.findAndCountAll({
                // attributes : ["id","title"],
                where: whereClause,
                include,
                order: [["id", "DESC"]],
                attributes: { exclude: ['user_id','lang_id'] },
                offset,
                limit,
                distinct: true, // tránh bị nhân bản khi join nhiều bảng
            });           

            return {
                rows,
                pagination: {
                    total: count,
                    page,
                    limit,
                    totalPages : Math.ceil(count / limit),
                }
            };
    },

    async getbyId(id){
        const whereClause = {
            id: id
        }
        const post = await Post.findOne({
            where: whereClause,
            attributes: { exclude: ['user_id','lang_id'] },
            include: [
                {
                    as : 'user',
                    model: User,
                    attributes: ["id", "username"],
                },
                {
                    as: 'categories',
                    model: Category,
                    attributes: ["id", "cat_name"],
                    through: { attributes: [] },
                },
                {
                    as: 'tags',
                    model: Tag,
                    attributes: ["id","name"],
                    through : { attributes:[] }
                },
                {
                    as : 'language',
                    model: Language,
                    attributes: ["id","lang_name"],
                },
                {
                    model: Comment,
                    attributes: ["id","content"],
                }
                  
            ]
        })

        return post;
    }, 
    
    async createPost(data){
        // Logic to create a new post
        const { tags, category, ...postData } = data; // tách tag_id ra khỏi postData

        const post = await Post.create(postData); // Tạo bài viết mới trước
        // Xử lý tag
        if (tags && Array.isArray(tags) && tags.length > 0) {
            await post.setTags(tags); // Thiết lập các tag cho bài viết
        }
        // Xử lý Category
        if (category && Array.isArray(category) && category.length > 0) {
            await post.setCategories(category); // Thiết lập các category cho bài viết
        }
        const newPost = await Post.findOne({ 
            where: { id: post.id }, 
            include: [
                { 
                    model: Tag, as: 'tags', 
                    attributes: ['id', 'name'], 
                    through: { attributes: [] }
                },
                { 
                    model: Category, as: 'categories', 
                    attributes: ['id', 'cat_name'], 
                    through: { attributes: [] }
                }
            ] 
        }); // Lấy data bài viết mới cùng với các tag đã liên kết

        return newPost;
    },

    update: async (id, updateData) => {
        // validation 
        const errors = validationResult(updateData);
        if (!errors.isEmpty()) {
            return responseUtils.error(res, errors.array());
        }
        const { tags, category, ...restData } = updateData;

        const whereClause = {
            id: id
        };

        const post = await Post.update(restData, {
            where: whereClause
        });

        // Nếu sửa tags thì chèn lại data
        if (tags && Array.isArray(tags)) {
            await post.setTags(tags);
        }
        // Nếu sửa category thì chèn lại 
        if (category && Array.isArray(category)) {
            await post.setCategories(category);
        }

        // Lấy lại thông tin sau khi sửa
        const updatedPost = await Post.findOne({
            where: whereClause,
            include: [
                { 
                    model: Tag, as: 'tags', 
                    attributes: ['id', 'name'], 
                    through: { attributes: [] }
                },
                { 
                    model: Category, as: 'categories', 
                    attributes: ['id', 'cat_name'], 
                    through: { attributes: [] }
                }
            ]
        });

        return updatedPost;
    },
    
    delete: async (postId) => {
        const whereClause = {
            id: postId
        };
        await Post.destroy({
            where: whereClause
        });
    },

};

module.exports = postService;