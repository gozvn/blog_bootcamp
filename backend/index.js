require("dotenv").config({
  path: "./.env",
});
require("rootpath")();
const express = require("express");
const bodyParser = require("body-parser");
const router = require("routes/api");
const { swaggerUIServe,swaggerUISetup } = require("kernels/api-docs");
const prefixPath = process.env.PREFIX_API_PATH || '/api/v1';
const cookieParser = require("cookie-parser");


const app = express();
app.disable("x-powered-by");


app.use(bodyParser.json());
app.use(cookieParser());
app.use(prefixPath, router);
app.use(express.json());


// SWAGGER
app.use("/api-docs", swaggerUIServe, swaggerUISetup);

module.exports = app
