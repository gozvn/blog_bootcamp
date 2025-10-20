const { Post,User,Category,PostCategory } = require("../../../models")

const postService = {
    async list() {
        const post = await Post.findAll({
        attributes: ["id", "title","created_at"],
        include: [
            {
                model: User,
                attributes: ["id","username"], // chỉ lấy cột username
            },
            {
                model: Category,
                attributes: ["id","cat_name"],
                through: { attributes: [] },
            }
        ],
        order: [["id", "DESC"]],
        });
        return post;
    },

    // async findById(id) {
    //     const post = await Post.findByPk(id);
    //     return post;
    // },

}

module.exports = postService