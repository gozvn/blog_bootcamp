import { Injectable } from '@angular/core';
import { BackendService } from '../../../../../../services/backend.service';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class LoginService {
  constructor(private backendService: BackendService) {}

  login(email: string, password: string): Observable<any> {
    return this.backendService
      .post('auth/login', { email, password }, { withCredentials: true })
      .pipe(
        tap((response: any) => {
          // lưu accessToken và refreshToken
          if (response?.data?.accessToken) {
            sessionStorage.setItem('accessToken', response.data.accessToken); // Lưu accessToken vào session
          }
        })
      );
  }
}

