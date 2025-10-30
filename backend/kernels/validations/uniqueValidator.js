// validators/uniqueValidator.js
module.exports = function unique(model, field, message = `${field} đã tồn tại`) {
  return {
    options: async (value) => {
      const condition = {};
      condition[field] = value;

      const existing = await model.findOne({ where: condition });
      if (existing) {
        throw new Error(message);
      }
      return true;
    },
  };
};
