import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { BackendService } from "./backend.service";
import { Observable } from "rxjs";
import { isPlatformBrowser } from "@angular/common";
import { TranslateService as NgxTranslateService } from "@ngx-translate/core";

@Injectable({
    providedIn: 'root'
})
export class AppTranslateService {

    private defaultLang: string = 'en';

    constructor(
        @Inject(PLATFORM_ID) private platformId: object,
        private backendService: BackendService,
        private ngx: NgxTranslateService
    ) {
        this.initLanguage();
    }

    /** Lấy danh sách ngôn ngữ từ API */
    getLanguages(): Observable<any> {
        return this.backendService.get('language');
    }

    /** Lưu ngôn ngữ vào localStorage (chỉ chạy browser) */
    setLanguage(lang: string) {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('lang', lang);
        }
        this.ngx.use(lang);   // đổi UI
    }

    /** Lấy ngôn ngữ hiện tại */
    getLanguage(): string {
        if (isPlatformBrowser(this.platformId)) {
            return localStorage.getItem('lang') || this.defaultLang;
        }
        return this.defaultLang; // fallback SSR
    }

    /** Khởi tạo ngôn ngữ (khi app bootstrap) */
    private initLanguage() {
        const lang = this.getLanguage();
        this.ngx.addLangs(['vi', 'en']);
        this.ngx.setDefaultLang(this.defaultLang);
        this.ngx.use(lang);
    }
}
