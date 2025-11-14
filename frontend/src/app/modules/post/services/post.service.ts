import { Injectable } from "@angular/core";
import { BackendService } from "../../../services/backend.service";
import { map } from "rxjs"; 

@Injectable({
    providedIn: 'root'
})
export class PostService {
    constructor(private backendService: BackendService) { }
    
    getPost(id: number) {
        return this.backendService.get(`public/post/${id}`).pipe(
            map((result: any) => result?.data ?? null)
        );
    }

}