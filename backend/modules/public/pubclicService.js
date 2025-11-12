const { Category,Post } = require("../../models");

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
    async listPosts(page = 1, limit = 10, categoryId = null, tagId = null, userId = null, langId = null, status = null, featured = null) {

            page = parseInt(page);
            limit = parseInt(limit);

            const offset = (page -1) * limit;
            const whereClause ={};
            const include = [
                    {
                        model: User,
                        attributes: ["id", "username"],
                    },
                    {
                        as: 'categories',
                        model: Category,
                        attributes: ["id", "cat_name"],
                        through: { attributes: [] },
                    },
                    {
                        as: 'tags',
                        model: Tag,
                        attributes: ["id","name"],
                        through : { attributes:[] }
                    },
                    {
                        model: Language,
                        attributes: ["id","lang_name"],
                    }
            ];
            // loc ngôn ngữ
            if (langId){
                whereClause.lang_id = langId;
            }
            // loc trạng thái
            if (status){
                whereClause.status = status;
            }
            // loc nổi bật
            if (featured !== null){
                whereClause.featured = featured;
            }
            // loc user
            if (userId){
                include[0].where = { id : userId};
            }
            // Filter theo cat ID 
            if (categoryId) {
                include[1].where = { id: categoryId };
            }
            // Filer theo tag
            if (tagId) {
                include[2].where = { id: tagId };           
            }

            const { count, rows } = await Post.findAndCountAll({
                // attributes : ["id","title"],
                where: whereClause,
                include,
                order: [["id", "DESC"]],
                attributes: { exclude: ['user_id','lang_id'] },
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
    },
};

module.exports = publicService;