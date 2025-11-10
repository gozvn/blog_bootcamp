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
const cors = require("cors");

const app = express();

app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'], 
}));


app.disable("x-powered-by");
// app.use(bodyParser.json()); 

app.use(express.json());
app.use(cookieParser());
app.use(prefixPath, router);

// SWAGGER
app.use("/api-docs", swaggerUIServe, swaggerUISetup);

module.exports = app
