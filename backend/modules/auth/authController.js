const responseUtils = require("utils/responseUtils");
const hash = require("kernels/hash/index.js");
const authService = require("./authService");
const userService = require("../user/userService");
const passport = require("passport");
const bcrypt = require('bcryptjs');
const { config } = require("configs");
const { bcrypt: bcryptConfig } = require('../../configs/hashing');
// const jwt = require("configs/jwt");
const jwtUtils = require("../../utils/jwtUtils")

const authController = {
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return responseUtils.invalidated(res, "validation.required")
            }

            const checkEmail = await authService.checkEmail(email)

            if (!checkEmail) {
                return responseUtils.invalidated(res, "validation.email")
            }
            // respone giống nhau
            const passwordMatches = await bcrypt.compare(password, checkEmail.password);
            if (!passwordMatches) {
                return responseUtils.invalidated(res, "validation.password");
            }

            const accessToken = jwtUtils.sign(checkEmail.id, checkEmail.role);
            const refreshToken = jwtUtils.signRefreshToken(checkEmail.id, checkEmail.role);

            const existingToken = await authService.checkTokenByUser(checkEmail.id);
            if (existingToken) {
                await existingToken.update({
                    token: refreshToken,
                    active: 1,
                    updated_at: new Date(),
                });
            } else {
                await authService.saveToken({
                    user_id: checkEmail.id,
                    token: refreshToken,
                    active: 1,
                });
            }

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,          // bảo vệ cookie khỏi truy cập từ JS (XSS)
                secure: false,           // bật true nếu HTTPS
                sameSite: "lax",      // hạn chế gửi cookie sang domain khác
                maxAge: 7 * 60 * 60 * 24 * 1000 // 7 ngày
            });
            const expiredAt = jwtUtils.getExpiredAt(accessToken);
            const loginData = {
                accessToken,
                expiredAt,
                user: {
                    id: checkEmail.id,
                    email: checkEmail.email,
                    username: checkEmail.username,
                    role: checkEmail.role,
                },
            };

            return responseUtils.ok(res, loginData)

        } catch (error) {
            console.error(error)
            return responseUtils.error(res, error)
        }
    },
    logout: async (req, res) => {
        try {
            // Lấy refresh_token từ cookie hoặc trong body
            const refreshToken = req?.cookies?.refresh_token || req?.body?.refresh_token;

            if (!refreshToken) {
                return responseUtils.error(res, "Chưa có refresh Token");
            }

            // Tìm token trong DB
            const existingToken = await authService.checkToken(refreshToken);
            if (!existingToken) {
                return responseUtils.notFound(res, "Token không hợp lệ hoặc đã bị xoá");
            }

            // xoá token
            await existingToken.destroy();

            // hoặc: await existingToken.destroy(); // nếu muốn xoá hẳn

            // Xoá cookie
            res.clearCookie("refresh_token", {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
            });

            return responseUtils.ok(res, "Đăng xuất thành công");
        } catch (error) {
            console.error(error);
            return responseUtils.error(res, error);
        }
    },
    refreshToken: async (req, res) => {
        try {
            // Lấy refresh_token từ cookie hoặc trong body
            const refreshToken = req?.cookies?.refresh_token || req?.body?.refresh_token;

            if (!refreshToken) {
                return responseUtils.notFound(res, "Chưa có refresh Token");
            }

            // Tìm token trong DB
            const existingToken = await authService.checkToken(refreshToken);
            if (!existingToken) {
                return responseUtils.notFound(res, "Token không hợp lệ hoặc đã bị xoá");
            }

            const decoded = jwtUtils.verifyRefreshToken(refreshToken);
            if (!decoded) {
                return responseUtils.error(res, "Refresh token không hợp lệ");
            }
            const newAccessToken = jwtUtils.sign(decoded.userId, decoded.role);

            return responseUtils.ok(res, { accessToken: newAccessToken })
        } catch (error) {
            console.error(error);
            return responseUtils.error(res, error);
        }

    },
    googleLogin: async (req, res) => {
        try {
            const { id_token } = req.body;
            if (!id_token) return responseUtils.error(res, "Thiếu Google ID token");

            const result = await authService.handleGoogleToken(id_token);
            return responseUtils.ok(res, result);
        } catch (error) {
            console.error(error);
            return responseUtils.error(res, error);
        }
    }
}

module.exports = authController;