import { Injectable } from '@angular/core';
import { BackendService } from '../../../services/backend.service';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class AuthService {

  constructor(private backendService: BackendService) {}

  /**
   * Đăng nhập người dùng bằng email và password.
   * @returns Observable trả về dữ liệu trả về từ backend sau khi đăng nhập thành công.
   */
  login(email: string, password: string): Observable<any> {
    // Gửi yêu cầu đăng nhập đến backend với email và password.

    return this.backendService.post('auth/login', { email, password }, { withCredentials: true }) 
    // withCredentials: true để gửi cookie cùng với yêu cầu.
      .pipe( // pipe: xử lý dữ liệu trả về từ backend.
        tap((response: any) => { // tap là toán tử xử lý dữ liệu để xử lý dữ liệu trả về từ backend.
          // Kiểm tra xem backend trả về accessToken hay không.
          if (response?.data?.accessToken) {
            // Lưu accessToken vào local storage.
            localStorage.setItem('accessToken', response.data.accessToken);
            // Lưu thông tin người dùng vào local storage.
            localStorage.setItem('user', JSON.stringify({
              id: response.data.user.id,
              email: response.data.user.email,
              username: response.data.user.username,
              role: response.data.user.role
            }));
          }
        })
      );
  }
  
  getUserInfo(): any {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      if (user) {
        return JSON.parse(user);
      }
    }
    return null;
  }
  signup(email: string, username: string, password: string): Observable<any> {
    return this.backendService.post('user/create', { email, username, password });
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    // this.backendService.delete('auth/logout', { withCredentials: true }).subscribe();
  }


}


