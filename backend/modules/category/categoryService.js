const { Post, Category } = require("../../models");

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
        const category = await Category.findOne({
            where: whereClause,
        })

        return category;
    }, 
    async create(data){
        const category = await Category.create(data);
        return category;
    },

    async update(id, data){
        const whereClause = {
            id: id
        }  
        const category = await Category.update(data, {
            where: whereClause
        });
        return category;
    },

    async delete(id){
        const whereClause = {
            id: id
        }
        const category = await Category.destroy({
            where: whereClause,
        });
        return category;
    }   
};

module.exports = categoryService;
