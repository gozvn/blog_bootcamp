import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class LangStoreService {

  private lang = 'en';

  constructor(
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    // Chỉ đọc localStorage ở browser
    if (isPlatformBrowser(this.platformId)) {
      this.lang = localStorage.getItem('lang') || 'en';
    }
  }

  /** Lấy ngôn ngữ hiện tại (SYNC – interceptor dùng được) */
  getLang(): string {
    return this.lang;
  }

  /** Set ngôn ngữ + sync localStorage */
  setLang(lang: string): void {
    this.lang = lang;

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('lang', lang);
    }
  }
}
