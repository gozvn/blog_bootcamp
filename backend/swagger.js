// backend/swagger.js
const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Blog Bootcamp API',
    description: 'Tài liệu API được sinh tự động bằng swagger-autogen',
  },
  host: 'localhost:3000', // chỉnh lại nếu server bạn chạy port khác
  schemes: ['http'],
};

const outputFile = './swagger-output.json'; // nơi lưu file swagger sinh ra
const endpointsFiles = ['./index.js']; // hoặc router chính nếu có

swaggerAutogen(outputFile, endpointsFiles);
