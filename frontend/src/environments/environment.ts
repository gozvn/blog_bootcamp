export const environment = {
    backendServer: {
        host: 'localhost:3000',
        prefix: '/api/v1',
        port: 3000,
        ssl: false,
        timeout: 30000,
    },
    cdn: {
        baseimageUrl: 'http://localhost:3000/',
    },
    production: false,
    googleClientId: '714171876760-0c4a4e3ivfu86bqc3vci6okl6deel7su.apps.googleusercontent.com',  // ← Điền GOOGLE_CLIENT_ID của bạn vào đây
};
