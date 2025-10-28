module.exports = {
  ok: (res, data) => {
    return res.status(200).send({
      success: true,
      status: 200,
      message: "ok",
      data,
    });
  },

  notFound: (res, message) => {
    return res.status(404).send({
      success: false,
      status: 404,
      message: message || "Cannot find resouces",
    });
  },

  error: (res, message) => {
    return res.status(500).send({
      success: false,
      status: 500,
      message: message || "Internal server error",
    });
  },

  unauthorized: (res, message) => {
    return res.status(401).send({
      success: false,
      status: 401,
      message: message || 'Unauthorized',
    });
  },

  invalidated: (res, errors) => {
    return res.status(422).send({
      success: false,
      status: 422,
      data: errors
    })
  },

  token: (res, message,accessToken, refreshToken) => {
    res.cookie("refreshtoken", token, {
      httpOnly: true,          // bảo vệ cookie khỏi truy cập từ JS (XSS)
      secure: false,           // bật true nếu HTTPS
      sameSite: "strict",      // hạn chế gửi cookie sang domain khác
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 ngày
    });
    return res.status(200).send({
      success: false,
      status: 200,
      message: {
          message : message,
          accessToken : accessToken
      },
    });
  }
};
