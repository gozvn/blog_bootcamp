import { HttpInterceptorFn } from '@angular/common/http';

export const JwtInterceptor: HttpInterceptorFn = (req, next) => {
  // Lấy accessToken từ local storage. type of windows !== 'undefined' để tránh lỗi khi chạy trên server side rendering. vì localStorage chỉ có trên trình duyệt.
  const isBrowser = typeof window !== 'undefined';
  const token = isBrowser ? localStorage.getItem("accessToken") : null;
  const userRaw = isBrowser ? localStorage.getItem("user") : null;

  // kiểm tra expired Token 
  if (isBrowser && userRaw) {
    try {
      const user = JSON.parse(userRaw);
      const expiredAt = Number(user?.expiredAt); // dạng: 1763981525 (giây)
      // nếu expiredAt < thời gian hiện tại thì xoá accessToken và user 
      if (expiredAt && expiredAt * 1000 < Date.now()) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        return next(req);
      }
    } catch {
      // nếu parse thất bại thì xoá accessToken và user
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
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