const { search } = require("index");
const { Category, Post, User, Tag, Language, Comment } = require("../../models");
const { Op, where, fn, col } = require("sequelize");

const publicService = {
    async searchPosts(keyword, page = 1, limit = 10) {
        keyword = keyword.trim();
        page = parseInt(page);
        limit = parseInt(limit);
        const offset = (page - 1) * limit;
        const whereClause = {
            status: "published"
        };
        if (keyword) {
            whereClause[Op.or] = [
                where(fn("LOWER", col("title")), {
                    [Op.like]: `%${keyword}%`
                })
            ];
        }
        const { count, rows } = await Post.findAndCountAll({
            where: whereClause,
            offset,
            limit,
            distinct: true,
        });
        return {
            rows,
            pagination: {
                total: count,
                page,
                limit,
                totalPages: Math.ceil(count / limit),
            }
        };
    },
    async listCategories(page, limit) {
        // Logic to list categories with pagination and filters
        const whereClause = {};
        const offset = (page - 1) * limit;
        const include = [];

        const { count, rows } = await Category.findAndCountAll({
            where: whereClause,
            include,
            order: [["id", "DESC"]],
            attributes: { exclude: ['created_at', 'updated_at'] },
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
                totalPages: Math.ceil(count / limit),
            }
        };
    },
    async listPosts(page = 1, limit = 10, categoryId = null, tagId = null, userId = null, langId = null, status = null, featured = null) {

        page = parseInt(page);
        limit = parseInt(limit);

        const offset = (page - 1) * limit;
        const whereClause = {
            status: "published"
        };
        const include = [
            {
                as: 'user',
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
                attributes: ["id", "name"],
                through: { attributes: [] }
            },
            {
                as: 'language',
                model: Language,
                attributes: ["id", "lang_name"],
            }
        ];
        // loc ngôn ngữ
        if (langId) {
            whereClause.lang_id = langId;
        }
        // loc nổi bật
        if (featured !== null) {
            whereClause.featured = featured;
        }
        // loc user
        if (userId) {
            include[0].where = { id: userId };
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
            attributes: { exclude: ['user_id', 'lang_id'] },
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
                totalPages: Math.ceil(count / limit),
            }
        };
    },
    async getPostById(postId) {
        const post = await Post.findOne({
            where: { id: postId },
            include: [
                {
                    as: 'user',
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
                    attributes: ["id", "name"],
                    through: { attributes: [] }
                },
                {
                    as: 'language',
                    model: Language,
                    attributes: ["id", "lang_name"],
                }
            ],
            attributes: { exclude: ['user_id', 'lang_id'] },
        });
        return post;
    },
    async getCategoryById(categoryId, page = 1, limit = 10) {
        page = parseInt(page);
        limit = parseInt(limit);
        const offset = (page - 1) * limit;

        // Lấy thông tin category (không include posts)
        const category = await Category.findOne({
            where: { id: categoryId },
            attributes: { exclude: ['created_at', 'updated_at'] },
        });

        if (!category) return null;

        // Lấy posts thuộc category với phân trang
        const { count, rows } = await Post.findAndCountAll({
            include: [
                {
                    model: Category,
                    as: 'categories',
                    where: { id: categoryId },
                    attributes: [], // không cần lấy thuộc tính category ở đây
                    through: { attributes: [] }
                }
            ],
            attributes: ["id", "title", "content", "slug"],
            offset,
            limit,
            order: [["id", "DESC"]],
            distinct: true,
        });

        // Gộp posts và pagination vào category.dataValues
        category.dataValues.posts = {
            rows,
            pagination: {
                total: count,
                page,
                limit,
                totalPages: Math.ceil(count / limit),
            }
        };

        return category;
    },
    getCommentsByPostId: async (postId, page = 1, limit = 10) => {
        page = parseInt(page);
        limit = parseInt(limit);
        const offset = (page - 1) * limit;
        const { count, rows } = await Comment.findAndCountAll({
            where: {
                post_id: postId,
                parent_id: null
            },
            include: [
                {
                    as: 'user',
                    model: User,
                    attributes: ["username"],
                },
                {
                    as: 'replies',
                    model: Comment,
                    include: [
                        {
                            as: 'user',
                            model: User,
                            attributes: ["username"]
                        }
                    ]
                }
            ],
            order: [
                ["id", "DESC"],
                [{ model: Comment, as: 'replies' }, 'id', 'ASC']
            ],
            attributes: { exclude: ['user_id', 'post_id'] },
            offset,
            limit,
            distinct: true
        });
        const comment = {
            rows,
            pagination: {
                total: count,
                page,
                limit,
                totalPages: Math.ceil(count / limit),
            }
        };

        return comment;
    }
};

module.exports = publicService;