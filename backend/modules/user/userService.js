const { User,Post,Language } = require("models");

const userService = {
    list: async (page, limit,id,role) => {

        const whereClause = {};
        const offset = (page - 1) * limit;

        const include = [
            {
                model: Language,
                attributes: ["id", "lang_name"],
            }
        ];

        if(id !== undefined && id !== null){
            whereClause.id = id;
        }
        
        if(role !== undefined && role !== null){
            whereClause.role = role;
        }

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
                totalPages
            }
        };
    },


};

module.exports = userService;