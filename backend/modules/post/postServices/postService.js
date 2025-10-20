const { Post, User, Category, Tag } = require("../../../models");

const postService = {
    async list(page = 1, limit = 10, categoryId = null, tagId = null, userId = null) {
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
                    }
            ];

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

    // async testCategories() {
    //     const postCategories = await PostCategory.findAll();
    //     console.log("PostCategory Data:", postCategories);
    //     return postCategories;
    // },

};

module.exports = postService;