import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const JwtInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  // Lấy accessToken từ local storage. type of windows !== 'undefined' để tránh lỗi khi chạy trên server side rendering. vì localStorage chỉ có trên trình duyệt.
  const isBrowser = typeof window !== 'undefined';
  const token = isBrowser ? localStorage.getItem("accessToken") : null;
  const userRaw = isBrowser ? localStorage.getItem("user") : null;

  // kiểm tra expired Token 
  if (isBrowser && userRaw) {
    try {
      const user = JSON.parse(userRaw);

      // Xử lý expiredAt - có thể là ISO string hoặc timestamp (giây)
      if (user?.expiredAt) {
        let expiryMs: number;

        if (typeof user.expiredAt === 'string') {
          // Nếu là ISO string, convert sang timestamp (milliseconds)
          expiryMs = new Date(user.expiredAt).getTime();
        } else {
          // Nếu là số (giây), convert sang milliseconds
          expiryMs = Number(user.expiredAt) * 1000;
        }

        // nếu expiredAt < thời gian hiện tại thì xoá accessToken và user
        if (expiryMs < Date.now()) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("user");
          // Redirect về login
          router.navigate(['auth', 'login']);
          return next(req);
        }
      }
    } catch {
      // nếu parse thất bại thì xoá accessToken và user
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      // Redirect về login
      router.navigate(['auth', 'login']);
    }
  }

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req);
};