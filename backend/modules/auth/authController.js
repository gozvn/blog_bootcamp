const responseUtils = require("utils/responseUtils");
const hash = require("kernels/hash/index.js");
const authService = require("./authService");

const access_token_ttl = process.env.ACCESS_TOKEN_TTL;

const bcrypt = require('bcryptjs');
const { bcrypt: bcryptConfig } = require('../../configs/hashing');
const jwt = require("configs/jwt");
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
            
            const accessToken = jwt.sign(
                {user_id:checkEmail.user_id},
                process.env.JWT_SECRET_KEY,
                {expiresIn: process.env.ACCESS_TOKEN_TTL}
            )   
            const refreshToken = crypto.randomBytes(64).toString('hex');
            const dataToken = {
                user_id: checkEmail.id,
                token: accessToken,
            }

            storeToken = await authService.saveToken(dataToken)

            res.cookie("refresh_token", refreshToken, {
                httpOnly: true,          // bảo vệ cookie khỏi truy cập từ JS (XSS)
                secure: false,           // bật true nếu HTTPS
                sameSite: "strict",      // hạn chế gửi cookie sang domain khác
                maxAge: process.env.REFRESH_TOKEN_TTL // 7 ngày
            });

            return responseUtils.ok(res,loginData)
            
        } catch (error) {
            console.error(error)
            return responseUtils.error(res, error)
        }
    }
}

module.exports = authController;