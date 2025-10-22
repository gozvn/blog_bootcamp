const { User,Post,Language } = require("models");

const userService = {
    list: async (page, limit) => {
        const whereClause = {};
        const offset = (page - 1) * limit;

        const include = [
            // {
            //     model: Post,
            //     attributes: ["id", "title"],
            // },
            {
                model: Language,
                attributes: ["id", "lang_name"],
            }
        ];

        const { count, rows } = await User.findAndCountAll({
            where: whereClause,
            include,
            order: [["id", "DESC"]],
            offset,
            limit,
            distinct: true, // tránh bị nhân bản khi join nhiều bảng
        }); 

        const totalPages = Math.ceil(count / limit);

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

    getbyID: async (id) => {
        const whereClause = {
            id: id
        }
        const user = await User.findOne({
            where: whereClause,
        });

        return user;
    }
    
};

module.exports = userService;