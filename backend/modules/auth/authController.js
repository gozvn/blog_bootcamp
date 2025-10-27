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
                {expiresIn: ACCESS_TOKEN_TTL}
            )   
            const refreshToken = crypto.randomBytes(64).toString('hex');
            const dataToken = {
                user_id: checkEmail.id,
                token: refreshToken,
                active:1,
                type:0
            }

            storeToken = await authService.saveToken(dataToken)
            
            if (storeToken.status == 200 ){
                loginData = {
                    accessToken : accessToken,
                    refreshToken : refreshToken
                }
            }

            responseUtils.ok(res,loginData)
            
        } catch (error) {
            console.error(error)
            responseUtils.error(res, error)
        }
    }
}

module.exports = authController;