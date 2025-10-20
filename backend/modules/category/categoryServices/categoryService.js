const { Post, Category } = require("../../../models");

const categoryService ={
    // Example method
    async list(page, limit) {
        // Logic to list categories with pagination and filters
        const whereClause = {};
        const offset = (page - 1) * limit;
        const include = [
            {
                model: Post,
                attributes: ["id", "title"],
                through: { attributes: [] },
            }
        ];

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
            pagniation: {
                total: count,
                page,
                limit,
                totalPages : Math.ceil(count / limit),
            }
        };
    } 
}

module.exports = categoryService;