import { Injectable } from "@angular/core";
import { BackendService } from "../../../services/backend.service";
import { map } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class HomeService {
    constructor(private backendService: BackendService) { }

    getPosts(limit: number = 0, page : number = 1) {
        const params:any ={};
        if (limit > 0) {
            params.limit = limit;
        }
        if (page > 0) {
            params.page = page;
        }
        return this.backendService.get('public/post', { params}).pipe(
        map((result: any) => result?.data ?? { rows: [], pagination: null })
        );
    }
    
    getfeaturedPosts(limit: number = 0, featured: boolean = true) {
        return this.backendService.get('public/post', { params: { limit, featured }}).pipe(
        map((result: any) => result?.data.rows ?? [])
        );
    }

}