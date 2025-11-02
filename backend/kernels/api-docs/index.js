const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const prefixPath = process.env.PREFIX_API_PATH || '/api/v1';
const port = process.env.PORT || 3000;

const options = {
    definition: {
    openapi: "3.0.0",
    info: {
        title: "Open API Coding Blog ",
        version: "1.0.11",
    },
    servers: [
        {
        url: `http://localhost:${port}${prefixPath}`,
        },
    ],
    },
    apis: ["./swagger/*.yaml"],
};

const openapiSpecification = swaggerJsdoc(options);

module.exports = {
    swaggerUIServe: swaggerUi.serve,
    swaggerUISetup: swaggerUi.setup(openapiSpecification)
}