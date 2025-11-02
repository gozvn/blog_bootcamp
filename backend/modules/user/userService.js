const { User,Post,Language } = require("models");
const user = require("models/user");

const userService = {
    list: async (page, limit,id,role,email) => {
        
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;

        const whereClause = {};
        const offset = (page - 1) * limit;

        const include = [ ];

        if(id !== undefined && id !== null){
            whereClause.id = id;
        }

        if(email !== undefined && email !== null){
            whereClause.email = email;
        }

        if(role !== undefined && role !== null){
            whereClause.role = role;
        }

        const { count, rows } = await User.findAndCountAll({
            where: whereClause,
            include,
            order: [["id", "DESC"]],
            attributes: { exclude: ['password'] },
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
    getbyId: async (id) => {
        const whereClause = {
            id: id
        }
        const user = await User.findOne({
            where: whereClause,
            attributes: { exclude: ['password'] },
        })
        return user;
    },

    checkExisting: async (email) => {
        const whereClause = {
            email: email,
        }
        const user = await User.findOne({
            where: whereClause,
            attributes: { exclude: ['password'] },
        })
        return user;
    }, 

    create: async (userData) => {
        const newUser = await User.create(userData);
        const { password, ...userWithoutPassword } = newUser.get({ plain: true });
        return userWithoutPassword;
    },

    update: async (userId, userData) => {
        const whereClause = {
            id: userId
        };  
        await User.update(userData, {
            where: whereClause
        });
        const updatedUser = await User.findOne({ 
            where: whereClause,
            attributes: { exclude: ['password'] },
        });
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