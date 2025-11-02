const responseUtils = require("utils/responseUtils");
const languageService = require("./languageService");
const { validationResult } = require("express-validator");

const languageController = {
    all: async (req, res) => {
        try {
            const id = parseInt(req.query.id) || null;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || parseInt(process.env.LANGUAGE_PAGINATION_LIMIT || 10);

            const languages = await languageService.list(page, limit, id);
            return responseUtils.ok(res, languages);
        } catch (error) {
            console.error(error);
            return responseUtils.error(res, error);
        }
    },

    getById: async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            if (!id) {
                return responseUtils.error(res, "chưa truyền ID");
            }

            const language = await languageService.getById(id);
            if (!language) {
                return responseUtils.notFound(res, "Không tồn tại ngôn ngữ này");
            }

            return responseUtils.ok(res, language);
        } catch (error) {
            console.error(error);
            return responseUtils.error(res, error);
        }
    },

    create: async (req, res) => {
        try {
            // Kiểm tra validate trước khi xử lý
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return responseUtils.invalidated(res, errors.array());
            }
            // Lấy dữ liệu từ request
            const { lang_code, lang_name } = req.body;
            
            if (!lang_code || !lang_name) {
                return responseUtils.invalidated(res, "chưa truyền ngôn ngữ");
            }

            const language = await languageService.create({
                lang_code,
                lang_name
            });

            return responseUtils.ok(res, language);
        } catch (error) {
            console.error(error);
            return responseUtils.error(res, error);
        }
    },

    update: async (req, res) => {
        try {
            // Kiểm tra validate trước khi xử lý
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return responseUtils.invalidated(res, errors.array());
            }
            
            const id = parseInt(req.params.id);
            if (!id) {
                return responseUtils.error(res, "chưa truyền ID ngôn ngữ");
            }

            const language = await languageService.getById(id);
            if (!language) {
                return responseUtils.notFound(res, "Không tồn tại ngôn ngữ này");
            }
            
            const {lang_code, lang_name} = req.body;
            if (!lang_code || !lang_name) {
                responseUtils.invalidated(res, "Cần truyền nội dung sửa ")
            }

            const updateData = {
                lang_code : lang_code,
                lang_name : lang_name
            }

            const updatedLanguage = await languageService.update(id, updateData);
            return responseUtils.ok(res,"Đã sửa thành công !");
        } catch (error) {
            console.error(error);
            return responseUtils.error(res, error);
        }
    },

    delete: async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            if (!id) {
                return responseUtils.error(res, "Yêu cầu id ngôn ngữ");
            }

            const language = await languageService.getById(id);
            if (!language) {
                return responseUtils.notFound(res, "Không tồn tại ngôn ngữ này");
            }

            await languageService.delete(id);
            return responseUtils.ok(res, { message: "Xóa thành công" });
        } catch (error) {
            console.error(error);
            return responseUtils.error(res, error);
        }
    }
};

module.exports = languageController;