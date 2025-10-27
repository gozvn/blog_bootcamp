const { Comment, User, Post } = require("../../models");

const commentService = {
    async list(page = 1 , limit = 10, id, userId) {
        const whereClause = {};
        const offset = (page - 1) * limit;
        
        if(id !== undefined && id !== null){
            whereClause.id = id;
        }

        if(userId !== undefined && userId !== null){
            whereClause.user_id = userId;
        }

        const include = [
            {
                model: User,
                attributes: ["id", "username"],
            },
            {
                model: Post,
                attributes: ["id", "title"],
            }
        ];

        const { count, rows } = await Comment.findAndCountAll({
            where: whereClause,
            include,
            order: [["id", "DESC"]],
            offset,
            limit,
            distinct: true
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

    async getById(id) {
        const comment = await Comment.findOne({
            where: { id },
            include: [
                {
                    model: User,
                    attributes: ["id", "username"],
                },
                {
                    model: Post,
                    attributes: ["id", "title"],
                }
            ]
        });
        return comment;
    },

    async create(data) {
        const comment = await Comment.create({
            content: data.content,
            user_id: data.user_id,
            post_id: data.post_id,
            created_at: new Date(),
            updated_at: new Date()
        });
        return comment;
    },

    async update(id, data) {
        const whereClause = { id };
        const updateData = {
            content: data.content,
            updated_at: new Date()
        };
        
        const comment = await Comment.update(updateData, {
            where: whereClause
        });
        return comment;
    },

    async delete(id) {
        const comment = await Comment.destroy({
            where: { id }
        });
        return comment;
    }
};

module.exports = commentService;