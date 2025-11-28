import { Injectable } from '@angular/core';
import { BackendService } from '../../../services/backend.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    constructor(
        private backendService: BackendService
    ) { }

    // User Service
    getUser(limit: number = 10, page: number = 1): Observable<any> {
        return this.backendService.get(`user?limit=${limit}&page=${page}`).pipe(
            map(response => response.data)
        );
    }
    getUserById(id: number): Observable<any> {
        return this.backendService.get(`user/${id}`).pipe(
            map(response => response.data)
        );
    }
    deleteUser(id: number): Observable<any> {
        return this.backendService.delete(`user/delete/${id}`).pipe(
            map(response => response.data)
        );
    }
    editUser(id: number, user: any): Observable<any> {
        return this.backendService.put(`user/edit/${id}`, user).pipe(
            map(response => response.data)
        );
    }
    // Post Service
    getPosts(page: number = 1, limit: number = 10, orderBy: string = 'DESC'): Observable<any> {
        return this.backendService.get(`post?limit=${limit}&page=${page}&orderBy=${orderBy}`).pipe(
            map(response => response.data)
        );
    }
    deletePost(id: number): Observable<any> {
        return this.backendService.delete(`post/delete/${id}`).pipe(
            map(response => response.data)
        );
    }
    // Category Service
    getCategories(limit: number = 10, page: number = 1): Observable<any> {
        return this.backendService.get(`category?limit=${limit}&page=${page}`).pipe(
            map(response => response.data)
        );
    }
    addCategory(category: any): Observable<any> {
        console.log(category);
        return this.backendService.post(`category/create`, category).pipe(
            map(response => response.data)
        );
    }
    editCategory(id: number, category: any): Observable<any> {
        console.log(category);
        return this.backendService.put(`category/edit/${id}`, category).pipe(
            map(response => response.data)
        );
    }
    deleteCategory(id: number): Observable<any> {
        return this.backendService.delete(`category/delete/${id}`).pipe(
            map(response => response.data)
        );
    }
    // Comment Service
    getComments(limit: number = 10, page: number = 1): Observable<any> {
        return this.backendService.get(`comment?limit=${limit}&page=${page}`).pipe(
            map(response => response.data)
        );
    }
    editComment(id: number, comment: any): Observable<any> {
        return this.backendService.put(`comment/edit/${id}`, comment).pipe(
            map(response => response.data)
        );
    }
    deleteComment(id: number): Observable<any> {
        return this.backendService.delete(`comment/delete/${id}`).pipe(
            map(response => response.data)
        );
    }
    // Token Service
    getToken(limit: number = 10, page: number = 1): Observable<any> {
        return this.backendService.get(`token?limit=${limit}&page=${page}`).pipe(
            map(response => response.data)
        );
    }
}