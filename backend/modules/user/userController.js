const responseUtils = require("utils/responseUtils")
const userSerivce = require("./userService.js");
const { validationResult } = require("express-validator");

const bcrypt = require('bcryptjs');
const { bcrypt: bcryptConfig } = require('../../configs/hashing'); 
const hash = require("kernels/hash/index.js");

const userController = {
    all: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || parseInt(process.env.CATEGORY_PAGINATION_LIMIT);
            const role = req.query.role || null;
            const email = req.query.email || null;
            const user = await userSerivce.list(page, limit,role,email);

            return responseUtils.ok(res,user)

        } catch (error) {
            console.error(error);
            responseUtils.error(res, error);
        }
    },
    getbyId: async (req, res) => {
        try {
            const id = req.params.id;
            const user = await userSerivce.getbyId(id);
            if (!user){
                return responseUtils.notFound(res, "Không tồn tại user");
            }
            return responseUtils.ok(res, user);
        } catch (error) {
            console.error(error);
            responseUtils.error(res, error);
        }
    },
    create: async (req, res) => {
        try {
            // Kiểm tra validate trước khi xử lý
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return responseUtils.invalidated(res, errors.array());
            }
            //  
            const raw = req.body;

            if (!raw.username || !raw.email || !raw.password) {
                return responseUtils.error(res, " Chua điền đủ thông tin !");
            }

            const hashedPassword = await bcrypt.hash(raw.password, bcryptConfig.rounds);

            const userData = {
                username: raw.username,
                email: raw.email,
                password: hashedPassword,
                role: raw.role || '4', // 4 for guest, 1 for admin
                avatar: raw.avatar || 'img/default-avatar.png',
                lang_id : raw.lang_id || 1,
                created_at: new Date(),
                updated_at: new Date(),
            };

            const newUser = await userSerivce.create(userData);
            return responseUtils.ok(res, newUser);
        } catch (error) {
            console.error(error);
            responseUtils.error(res, error);
        }
    },
    update: async (req, res) => {
        try {
            // Kiểm tra validate trước khi xử lý
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return responseUtils.invalidated(res, errors.array());
            }
            // Lấy dữ liệu từ request
            const userId = parseInt(req.params.id);
            const raw = req.body;

            const checkuser = await userSerivce.getbyId(userId);
            if (!checkuser) {
                return responseUtils.notFound(res, "Không có user hợp lệ !");
            }

            if (!raw || Object.keys(raw).length === 0) {
                return responseUtils.error(res, " Chua điền đủ thông tin !");
            }

            const userData = { 
                username: raw.username,
                email: raw.email,
                role: raw.role,
                avatar: raw.avatar,
                lang_id: raw.lang_id,
                updated_at: new Date(),
            };

            if (raw.password) {
            userData.password = await bcrypt.hash(raw.password, bcryptConfig.rounds);
            }
            const updatedUser = await userSerivce.update(userId, userData);
            return responseUtils.ok(res, updatedUser);

        } catch (error) {
            console.error(error);
            responseUtils.error(res, error);
        }
    },
    delete: async (req, res) => {
        try {
            // Lấy dữ liệu từ request
            const userId = parseInt(req.params.id);
            if (!userId) {
                return responseUtils.error(res, "Không có user hợp lệ !");
            }
            const checkuser = await userSerivce.getbyId(userId);
            if (!checkuser) {
                return responseUtils.error(res, "Không có user hợp lệ !");
            }
            await userSerivce.delete(userId);
            return responseUtils.ok(res, { message: "Xóa thành công" });
        } catch (error) {
            console.error(error);
            responseUtils.error(res, error);
        }
    },
}

module.exports = userController