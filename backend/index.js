require("dotenv").config({
  path: "./.env",
});
require("rootpath")();
const express = require("express");
const bodyParser = require("body-parser");
const router = require("routes/api");
const { swaggerUIServe,swaggerUISetup } = require("kernels/api-docs");
const prefixPath = process.env.PREFIX_PATH || '/api/v1';

const app = express();
app.disable("x-powered-by");


app.use(bodyParser.json());
app.use(prefixPath, router);
app.use(express.json());

// SWAGGER
app.use("/api-docs", swaggerUIServe, swaggerUISetup);

module.exports = app
