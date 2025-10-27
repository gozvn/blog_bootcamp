const { Post, Tag, PostTag } = require("../../models");

const tagService = {
  async list(page = 1, limit = 10, id) {

    page = parseInt(page);
    limit = parseInt(limit);
    
    const whereClause = {};
    const offset = (page - 1) * limit;
    const include = [
      {
        model: Post,
        as: 'posts',
        attributes: ["id", "title"],
        through: { attributes: [] },
      },
    ];
    if (id !== undefined && id !== null) {
      whereClause.id = id;
    }
    const { count, rows } = await Tag.findAndCountAll({
      where: whereClause,
      include,
      order: [["id", "DESC"]],
      offset,
      limit,
      distinct: true,
    });

    return {
      rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  },

  async getbyID(id) {
    const whereClause = { id };
    const tag = await Tag.findOne({ where: whereClause });
    return tag;
  },

  async create(data) {
    // tạo tag trước
    const tag = await Tag.create(data);
    return tag;
  },

  async update(id, data) {
    const whereClause = { id };
    const tag = await Tag.update(
      {
        name: data.name,
        slug: data.slug,
        updated_at: data.updated_at || new Date(),
      },
      { where: whereClause }
    );
    return tag;
  },

  async delete(id) {
    const whereClause = { id };
    const tag = await Tag.destroy({ where: whereClause });
    return tag;
  },
};

module.exports = tagService;
