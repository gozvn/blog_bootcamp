const { getbyID } = require("modules/category/categoryService");
const { Post, User, Category, Tag, Language } = require("../../models");

const postService = {
    async list(page = 1, limit = 10, categoryId = null, tagId = null, userId = null, langId = null, status = null, featured = null) {
            const offset = (page -1) * limit;
            const whereClause ={};
            const include = [
                    {
                        model: User,
                        attributes: ["id", "username"],
                    },
                    {
                        model: Category,
                        attributes: ["id", "cat_name"],
                        through: { attributes: [] },
                    },
                    {
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

    async getbyID(id){
        const whereClause = {
            id: id
        }
        const post = await Post.findOne({
            where: whereClause,
        })

        return post;
    } 
    
    // async testCategories() {
    //     const postCategories = await PostCategory.findAll();
    //     console.log("PostCategory Data:", postCategories);
    //     return postCategories;
    // },

};

module.exports = postService;