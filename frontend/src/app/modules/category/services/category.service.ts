import { Injectable } from '@angular/core';
import { BackendService } from '../../../services/backend.service';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class CategoryService  {
    constructor(private backendService: BackendService) {}
    getCategories(): Observable<any> {
        return this.backendService.get('public/category').pipe(
            tap((response: any) => {
                // Xử lý dữ liệu nếu cần
            })
        );
    }

    getCategoryPosts(categoryId: number, page: number): Observable<any> {
        return this.backendService.get(`public/category/${categoryId}?page=${page}`).pipe(
            tap((response: any) => {
                // Xử lý dữ liệu nếu cần
            })
        );
    }
    
}