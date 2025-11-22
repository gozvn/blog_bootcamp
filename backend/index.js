require("dotenv").config({
  path: "./.env",
});
require("rootpath")();
const express = require("express");
const bodyParser = require("body-parser");
const router = require("routes/api");
const { swaggerUIServe, swaggerUISetup } = require("kernels/api-docs");
const prefixPath = process.env.PREFIX_API_PATH || '/api/v1';
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

const corsOptions = {
  origin: 'http://localhost:4200', // Không dùng '*'
  credentials: true, // Cho phép gửi cookie, credentials
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.disable("x-powered-by");
// app.use(bodyParser.json()); 

app.use(express.json());
app.use(cookieParser());
// Cho phép truy cập vào thư mục uploads
app.use('/uploads', express.static('uploads'));
app.use(prefixPath, router);

// SWAGGER
app.use("/api-docs", swaggerUIServe, swaggerUISetup);

module.exports = app
