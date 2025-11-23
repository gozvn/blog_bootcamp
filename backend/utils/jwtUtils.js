const { config } = require("configs");
const jwt = require("jsonwebtoken");

module.exports = {
  sign: (userId, userRole) => {
    const access_token = jwt.sign(
      {
        userId: userId,
        role: userRole,
      },
      config.jwt.secret,
      {
        expiresIn: config.jwt.ttl,
      }
    );

    return access_token;
  },
  signRefreshToken: (userId, userRole) => {
    const refresh_token = jwt.sign(
      {
        userId: userId,
        role: userRole,
      },
      config.jwt.secret,
      {
        expiresIn: "1y",
      }
    );

    return refresh_token;
  },
  verifyRefreshToken: (refreshToken) => {
    try {
      return jwt.verify(refreshToken, config.jwt.secret)
    } catch (error) {
      return null;
    }
  },
  verify: (token) => {
    try {
      return jwt.verify(token, config.jwt.secret);
    } catch (error) {
      return null;
    }
  },
  getExpiredAt: (token) => {
    try {
      const decoded = jwt.decode(token);
      return decoded.exp;
    } catch (error) {
      return null;
    }
  },
};
