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
app.disable("x-powered-by");
// Option cho CORS 
const corsOptions = {
  origin: 'http://localhost:4200',  // domain frontend cụ thể
  credentials: true,                 // cho phép gửi cookie, header xác thực
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  // các phương thức được phép
  allowedHeaders: ['Content-Type', 'Authorization'],    // header được phép
};

app.use(cors(corsOptions)); // Sử dụng CORS với các option đã định nghĩa
// Bắt OPTIONS preflight request với cấu hình cors giống trên
app.options('*', cors(corsOptions));

app.use(bodyParser.json());
app.use(cookieParser());
app.use(prefixPath, router);
app.use(express.json());


// SWAGGER
app.use("/api-docs", swaggerUIServe, swaggerUISetup);

module.exports = app
