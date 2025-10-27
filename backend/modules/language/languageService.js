const { Language, User, Post } = require("../../models");

const languageService = {
    async list(page, limit, id) {
        const whereClause = {};
        const offset = (page - 1) * limit;
        
        if(id) whereClause.id = id;

        const include = [];

        const { count, rows } = await Language.findAndCountAll({
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
        const language = await Language.findOne({
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
        return language;
    },

    async create(data) {
        const language = await Language.create({
            lang_code: data.lang_code,
            lang_name: data.lang_name,
            created_at: new Date(),
            updated_at: new Date()
        });
        return language;
    },

    async update(id, data) {
        const whereClause = { id };
        const updateData = {
            lang_code: data.lang_code,
            lang_name: data.lang_name,
            updated_at: new Date()
        };
        
        const language = await Language.update(updateData, {
            where: whereClause
        });
        return language;
    },

    async delete(id) {
        const language = await Language.destroy({
            where: { id }
        });
        return language;
    }
};

module.exports = languageService;