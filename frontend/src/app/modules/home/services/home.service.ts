import { Injectable } from "@angular/core";
import { BackendService } from "../../../services/backend.service";
import { map } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class HomeService {
    constructor(private backendService: BackendService) { }

    getPosts(limit: number = 0) {
        const params:any ={};
        if (limit > 0) {
            params.limit = limit;
        }
        return this.backendService.get('post', { params}).pipe(
        map((result: any) => result?.data ?? [])
        );
    }
    getfeaturedPosts(limit: number = 0, featured: boolean = true) {
        return this.backendService.get('post', { params: { limit, featured }}).pipe(
        map((result: any) => result?.data ?? [])
        );
    }

}