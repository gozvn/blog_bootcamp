const responseUtils = require("utils/responseUtils");
const { User, UserToken } = require("../../models");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const authService = {
    async checkEmail(email) {

        const whereClause = {
            email: email
        }
        const checkEmail = await User.findOne({
            where: whereClause,
        })
        return checkEmail
    },
    async saveToken(data) {
        const token = await UserToken.create(data)
        return token
    },
    async checkTokenByUser(user_id) {
        const checkToken = await UserToken.findOne({
            where: { user_id }
        });
        return checkToken;
    },
    async checkToken(token) {
        const checkToken = await UserToken.findOne({
            where: { token }
        });
        return checkToken;
    },
    async handleGoogleToken(id_token) {
        try {
            const ticket = await client.verifyIdToken({
                idToken: id_token,
                audience: process.env.GOOGLE_CLIENT_ID
            })
            const payload = ticket.getPayload();
            const email = payload.email;
            const name = payload.name;
            const picture = payload.picture;

            // Kiểm tra hoặc tạo user
            let user = await User.findOne({ where: { email } });
            if (!user) {
                user = await User.create({
                    id: User.id,
                    email,
                    username: name,
                    avatar: picture,
                    role: 4
                });
            }

            const accessToken = jwtUtils.sign(user.id, user.role);
            const refreshToken = jwtUtils.signRefreshToken(user.id, user.role);

            return {
                accessToken,
                refreshToken,
                user
            }
        } catch (error) {
            return responseUtils.error(error)
        }
    }
}

module.exports = authService;