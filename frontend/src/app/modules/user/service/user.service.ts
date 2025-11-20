import { BackendService } from "../../../services/backend.service";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class UserService {

    constructor(private backendService: BackendService) {}

    getPostByUser(userId: number, page: number = 1, limit: number = 10): Observable<any> {
        return this.backendService.get(`post?user_id=${userId}&page=${page}&limit=${limit}`).pipe(
            map((result: any) => result?.data ?? null)
        );
    }

    createPost(userId: number, post: any) {
       //   return this.backendService.post<any>(`/users/${userId}/posts`, post);
    }

    editPost(userId: number, postId: number, post: any){
       //   return this.backendService.put<any>(`/users/${userId}/posts/${postId}`, post);
    }

    deletePost(postId: number){
        //   return this.backendService.delete<void>(`/users/${userId}/posts/${postId}`);
        return this.backendService.delete(`post/delete/${postId}`).pipe(
            map((result: any) => result?.data ?? null)
        );
    }

}