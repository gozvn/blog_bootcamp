export const environment = {
    backendServer: {
        host: 'dbblog.sunvoz.com',
        prefix: '/api/v1',
        port: 443,
        ssl: true,
        timeout: 30000,

    },
    cdn: {
        baseimageUrl: 'http://dbblog.sunvoz.com/', // Lưu tạm ở đaay
    },
    production: true,
    googleClientId: '714171876760-0c4a4e3ivfu86bqc3vci6okl6deel7su.apps.googleusercontent.com',  // ← Điền GOOGLE_CLIENT_ID của bạn vào đây
};