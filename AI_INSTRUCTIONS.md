# Hướng dẫn dành cho AI / AI Instructions & Codebase Conventions

Tài liệu này cung cấp cái nhìn tổng quan về kiến trúc, cách tổ chức thư mục và coding conventions của dự án "Blog". Bất kỳ AI Assistant nào (như Claude Code) khi thực hiện các thay đổi vào dự án này đều **bắt buộc** phải tuân thủ nghiêm ngặt các nguyên tắc dưới đây.

---

## 1. Tổng quan Kiến trúc

Dự án là một ứng dụng Web Blog bao gồm:
- **Backend:** Node.js (Express), Sequelize (ORM), Redis (Caching), JWT (Authentication).
- **Frontend:** Angular v17+.

Cấu trúc Repository:
```text
/ (root)
├── backend/    # Mã nguồn Node.js API
├── frontend/   # Mã nguồn Angular Web App
└── README.md
```

---

## 2. Backend Dành cho AI (`/backend`)

Backend được tổ chức theo kiến trúc **Modular Monolith**. Thay vì gộp chung tất cả Controllers vào một thư mục và Services vào một thư mục, dự án chia nhỏ theo từng "Module" (Tính năng / Entity).

### 2.1 Cấu trúc thư mục Backend quan trọng
```text
backend/
├── configs/          # Chứa các file cấu hình (app, database, hashing, jwt). Tập trung config tại index.js
├── database/         # Chứa Sequelize migrations và seeders
├── kernels/          # Các thành phần lõi (middlewares, validations rules, utils lõi, hash)
├── models/           # Định nghĩa các Sequelize Models (Post, User, Category, Tag...)
├── modules/          # **Nơi chứa logic chính**, chia theo từng Entity/Tính năng.
├── routes/           # Định nghĩa Routing (api.js). Dùng thư viện express-router-group.
├── utils/            # Các helper và utilities dùng chung (responseUtils.js, jwtUtils.js, redisCache.js)
├── index.js          # Khởi tạo Express app, setup middlewares tổng.
└── server.js         # Entry point, start server.
```

### 2.2 Quy tắc viết Code Backend (Conventions)

Khi AI tạo mới, thay đổi hay bảo trì một tính năng ở Backend, HÃY TUÂN THỦ:

1. **Cấu trúc Module Trong `/modules/<Tên Module>`**:
   Mỗi tính năng phải nằm trong thư mục riêng của nó (VD: `/modules/post`).
   Quy ước đặt tên file trong một module:
   - `[moduleName]Controller.js`: Xử lý HTTP Request/Response, Extract parameters, gọi xuống Service. KHÔNG NÊN chứa business logic phức tạp ở đây. Luôn dùng `responseUtils` để trả data.
   - `[moduleName]Service.js`: Chứa Business Logic cốt lõi, thao tác trực tiếp với Database (Sequelize Models).
   - `[moduleName]Validation.js`: Định nghĩa các object schema validation (dùng cùng với `express-validator`).

2. **Xử lý Response**:
   Luôn sử dụng helper `utils/responseUtils.js` để trả về response thay vì dùng `res.send()` rải rác:
   - `responseUtils.ok(res, data, message)`
   - `responseUtils.error(res, error)`
   - `responseUtils.notFound(res, message)`
   - `responseUtils.invalidated(res, validationErrors)`

3. **Routing**:
   Routing được khai báo tập trung ở `routes/api.js`.
   Sử dụng cú pháp `router.group` (nhờ package `express-router-group`) để gom nhóm router, gán params, middleware cho gọn.

4. **Validation**:
   Import file validation module vào trong `routes/api.js`. Dùng hàm `checkSchema` từ `express-validator`.
   Ví dụ: `router.post('/create', authMiddleware, checkRole(4), checkSchema(postValidation.createPost), postController.create);`

5. **Token Caching (Tuỳ chọn tính năng)**:
   Nếu cần Cache (như danh sách Post), sử dụng `utils/redisCache.js`.

---

## 3. Frontend Dành Cho AI (`/frontend`)

Frontend được xây dựng bằng **Angular**. Sử dụng SASS/SCSS.

### 3.1 Cấu trúc thư mục Frontend (`src/app/`)
```text
frontend/src/app/
├── guard/            # Chứa các file Route Guards (auth.guard.ts,...)
├── helper/           # Chứa các hàm hỗ trợ chung (errorMessage.ts,...)
├── interceptors/     # Chứa HTTP Interceptors (jwt.interceptor.ts, lang.interceptor.ts)
├── layouts/          # Chứa các Layout Container (dashboard, default)
├── models/           # Interfaces / Class models (post.model.ts, user.model.ts)
├── modules/          # Chứa các module / tính năng / trang (tương tự như backend)
├── pipes/            # Custom pipes biến đổi data trên view
├── services/         # API services dùng chung gọi backend (auth.service.ts, backend.service.ts)
├── validations/      # Custom RxJS/Form Validators dùng chung
├── app.routes.ts     # Khai báo cấu trúc Route
└── app.config.ts / app.config.server.ts # config khởi tạo app
```

### 3.2 Quy tắc viết Code Frontend (Conventions)

Khi AI làm việc với Frontend, yêu cầu:

1. **Phân chia Route Component (Modules)**:
   Mã nguồn của các màn hình (pages) đặt toàn bộ trong `/modules/`.
   Ví dụ: `/modules/post/lists`, `/modules/post/detail`.

2. **Dịch vụ API (Services)**:
   Các Service tương tác API với backend thường được đặt chung trong thư mục global `/services/` thay vì đặt cục bộ (Ví dụ: `backend.service.ts`, `auth.service.ts`).
   Đối với các logic gọi API, luôn xây dựng các return type mạnh, import Interfaces/Classes từ thư mục `/models/`.

3. **Quản lý Component Layout**:
   Các Component khung như Sidebar, Header, Footer được khai báo tương ứng trong layout của nó tại `/layouts/`.

4. **Styles**:
   Sử dụng SCSS.

---

## 4. Ghi chú chung (General Workflow)

1. Khi được yêu cầu **sửa một API**:
   - Mở `backend/routes/api.js` để xem định tuyến.
   - Theo dõi vào Controller tương ứng trong `backend/modules/xyz/xyzController.js`.
   - Cập nhật logic xử lý Database ở `backend/modules/xyz/xyzService.js`.
2. Khi được yêu cầu **đổi cấu trúc Database**:
   - Cập nhật file Model trong `backend/models/`.
   - Nếu dự án dùng Migration, cập nhật/thêm Migration mới.
3. Khi được yêu cầu **sửa giao diện**:
   - Xác định route đang nói đến, tìm Component trong `frontend/src/app/modules/`.
   - Nếu liên quan đến lấy dữ liệu API, tra cứu `frontend/src/app/services/`.

Mọi thay đổi cần giữ nguyên ngôn ngữ thiết kế và cấu trúc thư mục của dự án, tuân thủ Clean Code và DRY (Don't Repeat Yourself).
