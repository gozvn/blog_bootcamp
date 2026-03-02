const { User, UserToken } = require("../../models");
const { OAuth2Client } = require("google-auth-library");
const jwtUtils = require("../../utils/jwtUtils");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const authService = {
    async checkEmail(email) {
        const checkEmail = await User.findOne({ where: { email } });
        return checkEmail;
    },

    async saveToken(data) {
        const token = await UserToken.create(data);
        return token;
    },

    async checkTokenByUser(user_id) {
        const checkToken = await UserToken.findOne({ where: { user_id } });
        return checkToken;
    },

    async checkToken(token) {
        const checkToken = await UserToken.findOne({ where: { token } });
        return checkToken;
    },

    /**
     * Xử lý Google OAuth token:
     * 1. Verify id_token với Google
     * 2. Tìm user theo google_id → login luôn
     * 3. Nếu không, tìm user theo email → gắn google_id vào tài khoản đó
     * 4. Nếu hoàn toàn mới → tạo user mới (không có password)
     */
    async handleGoogleToken(id_token) {
        // 1. Verify token với Google
        const ticket = await client.verifyIdToken({
            idToken: id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const googleId = payload.sub;       // Google unique ID
        const email = payload.email;
        const name = payload.name;
        const picture = payload.picture;

        let user = null;

        // 2. Tìm theo google_id trước (trường hợp đã đăng nhập Google trước đó)
        user = await User.findOne({ where: { google_id: googleId } });

        // 3. Nếu không tìm thấy theo google_id, thử tìm theo email
        if (!user) {
            user = await User.findOne({ where: { email } });

            if (user) {
                // Tài khoản email đã tồn tại → gắn thêm google_id
                await user.update({
                    google_id: googleId,
                    auth_provider: 'google',
                    avatar: user.avatar || picture, // giữ avatar cũ nếu có
                });
            }
        }

        // 4. Hoàn toàn mới → tạo user mới
        if (!user) {
            user = await User.create({
                email,
                username: name,
                avatar: picture,
                google_id: googleId,
                auth_provider: 'google',
                password: null,
                role: '4',
            });
        }

        // 5. Tạo token
        const accessToken = jwtUtils.sign(user.id, user.role);
        const refreshToken = jwtUtils.signRefreshToken(user.id, user.role);

        // 6. Lưu refresh token vào DB (upsert)
        const existingToken = await authService.checkTokenByUser(user.id);
        if (existingToken) {
            await existingToken.update({ token: refreshToken, active: 1, updated_at: new Date() });
        } else {
            await authService.saveToken({ user_id: user.id, token: refreshToken, active: 1 });
        }

        return {
            accessToken,
            refreshToken,
            expiredAt: jwtUtils.getExpiredAt(accessToken),
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                role: user.role,
                avatar: user.avatar,
            },
        };
    },
};

module.exports = authService;