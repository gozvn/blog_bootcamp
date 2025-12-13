import { BackendService } from "../../../services/backend.service";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class UserService {

    constructor(private backendService: BackendService) { }

    getPostByUser(userId: number, categoryId: number, title: string, status: string, page: number = 1, limit: number = 10): Observable<any> {
        // Xây dựng query params động, chỉ thêm các tham số có giá trị
        const queryParams: string[] = [
            `user_id=${userId}`,
            `page=${page}`,
            `limit=${limit}`
        ];

        // Chỉ thêm categoryId nếu có giá trị hợp lệ (> 0)
        if (categoryId && categoryId > 0) {
            queryParams.push(`category_id=${categoryId}`);
        }

        // Chỉ thêm title nếu không rỗng
        if (title && title.trim() !== '') {
            queryParams.push(`title=${encodeURIComponent(title)}`);
        }

        // Chỉ thêm status nếu có giá trị (published/draft)
        if (status && status.trim() !== '') {
            queryParams.push(`status=${status}`);
        }

        const queryString = queryParams.join('&');
        // console.log("Query String: ", queryString);

        return this.backendService.get(`post?${queryString}`).pipe(
            map((result: any) => result?.data ?? null)
        );
    }
    getPostById(postId: number): Observable<any> {
        return this.backendService.get(`post/${postId}`).pipe(
            map((result: any) => result?.data ?? null)
        );
    }
    uploadImage(image: File): Observable<any> {
        const formData = new FormData();
        formData.append('image', image);
        return this.backendService.post(`upload`, formData).pipe(
            map((result: any) => result?.data ?? null)
        );
    }
    getCategories(): Observable<any> {
        return this.backendService.get(`public/category`).pipe(
            map((result: any) => result?.data ?? null)
        );
    }
    getLanguages(): Observable<any> {
        return this.backendService.get(`language`).pipe(
            map((result: any) => result?.data ?? null)
        );
    }
    createPost(post: any): Observable<any> {
        return this.backendService.post(`post/create`, post).pipe(
            map((result: any) => result?.data ?? null)
        );
    }
    createTags(tags: any): Observable<any> {
        const body = {
            name: tags
        }
        return this.backendService.post(`tag/create`, body).pipe(
            map((result: any) => result?.data ?? null)
        );
    }
    editPost(postId: number, post: any) {
        // console.log(post, "ID", postId);
        return this.backendService.put(`post/edit/${postId}`, post).pipe(
            map((result: any) => result?.data ?? null)
        );
    }
    deletePost(postId: number) {
        return this.backendService.delete(`post/delete/${postId}`).pipe(
            map((result: any) => result?.data ?? null)
        );
    }

}