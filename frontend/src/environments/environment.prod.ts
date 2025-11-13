export const environment = {
    backendServer : {
        host: 'localhost:3000',
        prefix : '/api/v1',
        port : 443,
        ssl : false,
        timeout : 30000,
        
    },
    cdn: {
        baseimageUrl: 'http://localhost:4200/assets', // Lưu tạm ở đaay
    },
    production: false,
};