const { User,Post,Language } = require("models");
const user = require("models/user");

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
    create: async (userData) => {
        const newUser = await User.create(userData);
        return newUser;
    },

    update: async (userId, userData) => {
        const whereClause = {
            id: userId
        };  
        await User.update(userData, {
            where: whereClause
        });
        const updatedUser = await User.findOne({ where: whereClause });
        return updatedUser;
    },
    delete: async (userId) => {
        const whereClause = {
            id: userId
        };
        await User.destroy({
            where: whereClause
        });
    }
};

module.exports = userService;