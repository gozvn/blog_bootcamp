const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Blog Bootcamp API',
      version: '1.0.0',
      description: 'API documentation generated using swagger-jsdoc from JSDoc comments.',
    },
    servers: [
        { url: 'http://localhost:3000' }
    ],
  },
  // Đường dẫn đến file api.js của bạn
  apis: ['./routes/api.js'], 
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec; // Xuất spec để dùng trong server.js