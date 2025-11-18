import { BackendService } from "../../../services/backend.service";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class CommentService {
    constructor(private http: HttpClient, private backendService: BackendService) {}
    // Tạo comment mới
    postComment(user_id: number, content: string, post_id: number, parent_id: number | null): Observable<any> {
        const body = { user_id, content, post_id, parent_id: null };
        return this.backendService.post('comment/create', body).pipe(
            map(response => response.data)
        );
    }
    // Lấy danh sách comment theo post_id với phân trang
    getCommentsByPostId(post_id: number, page:number, limit:number): Observable<any> {
        // console.log(`Fetching comments for post_id: ${post_id}, page: ${page}, limit: ${limit}`);
        return this.backendService.get(`public/comment/${post_id}?page=${page}&limit=${limit}`).pipe(
            map(response => response.data)
        );
        
    }

}
