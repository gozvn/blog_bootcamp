const responseUtils = require("utils/responseUtils");
const hash = require("kernels/hash/index.js");
const authService = require("./authService");

const access_token_ttl = process.env.ACCESS_TOKEN_TTL;

const bcrypt = require('bcryptjs');
const { bcrypt: bcryptConfig } = require('../../configs/hashing');
// const jwt = require("configs/jwt");
const jwtUtils = require("../../utils/jwtUtils")
const { check } = require("express-validator");


const authController = {
    login : async (req, res) => {
        try {
            const { email, password } = req.body;

            if (!email || !password ) {
                responseUtils.error(res, " Chưa truyền email, password ")
            }
            

            console.log(email,password)
            const checkEmail = await authService.checkEmail(email)

            if (!checkEmail) {
                return responseUtils.notFound(res, "Email hoặc mật khẩu không đúng !")
            }
            // respone giống nhau
            const passwordMatches = await bcrypt.compare(password, checkEmail.password);
            if (!passwordMatches) {
                return responseUtils.notFound(res, "Email hoặc mật khẩu không đúng !");
            }
            
            const accessToken = jwtUtils.sign(checkEmail.id,checkEmail.role);
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

            res.cookie("refresh_token", refreshToken, {
                httpOnly: true,          // bảo vệ cookie khỏi truy cập từ JS (XSS)
                secure: false,           // bật true nếu HTTPS
                sameSite: "strict",      // hạn chế gửi cookie sang domain khác
                maxAge: 7* 60 *60 *24 *1000 // 7 ngày
            });

            const loginData = {
                    accessToken,
                    user: {
                        id: checkEmail.id,
                        email: checkEmail.email,
                        name: checkEmail.name,
                    },
            };

            return responseUtils.ok(res,loginData)
            
        } catch (error) {
            console.error(error)
            return responseUtils.error(res, error)
        }
    }
}

module.exports = authController;