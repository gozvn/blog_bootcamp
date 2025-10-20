const { Post, User, Category, Tag } = require("../../../models");

const postService = {
    async list() {
        const post = await Post.findAll({
            attributes: ["id", "title", "created_at"],
            include: [
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
            ],
            order: [["id", "DESC"]],
        });
        return post;
    },

    async testCategories() {
        const postCategories = await PostCategory.findAll();
        console.log("PostCategory Data:", postCategories);
        return postCategories;
    },

    // async findById(id) {
    //     const post = await Post.findByPk(id);
    //     return post;
    // },
};

module.exports = postService;