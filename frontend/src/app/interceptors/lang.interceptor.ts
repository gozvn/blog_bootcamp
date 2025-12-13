import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LangStoreService } from '../services/langStore.service';

export const langInterceptor: HttpInterceptorFn = (req, next) => {
  const langStore = inject(LangStoreService);
  const lang = langStore.getLang();

  // ✅ Chỉ áp dụng cho GET request và post URL
  const allowLang =
    req.method === 'GET' &&
    (req.url.includes('/public/post') || req.url.includes('/post'));

  if (!allowLang) {
    return next(req);
  }

  // ❌ Nếu đã có lang_code thì không gắn nữa
  if (req.params.has('lang_code')) {
    return next(req);
  }

  const newReq = req.clone({
    setParams: { lang_code: lang }
  });

  return next(newReq);
};
