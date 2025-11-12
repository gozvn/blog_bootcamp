const { Category } = require("../../models");

const publicService = {
    async listCategories(page, limit) {
            // Logic to list categories with pagination and filters
            const whereClause = {};
            const offset = (page - 1) * limit;
            const include = [    ];
    
            const { count, rows } = await Category.findAndCountAll({
                where: whereClause,
                include,
                order: [["id", "DESC"]],
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

};

module.exports = publicService;