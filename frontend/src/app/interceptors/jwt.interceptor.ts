import { HttpInterceptorFn } from '@angular/common/http';

export const JwtInterceptor: HttpInterceptorFn = (req, next) => {
  // Lấy accessToken từ local storage. type of windows !== 'undefined' để tránh lỗi khi chạy trên server side rendering. vì localStorage chỉ có trên trình duyệt.
  const token = typeof window !== 'undefined' ? localStorage.getItem("accessToken") : null;

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req);
};