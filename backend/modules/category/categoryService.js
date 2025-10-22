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
    async getbyID(id){
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
        const [results] = await Category.sequelize.query(
            'UPDATE categories SET cat_name = ?, thumbnail = ?, description = ?, updated_at = ? WHERE id = ?',
            {
                replacements: [
                    data.cat_name,
                    data.thumbnail,
                    data.description,
                    new Date(),
                    id
                ],
                type: Category.sequelize.QueryTypes.UPDATE
            }
        );
        return results;
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
