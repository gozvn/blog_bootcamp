import { Injectable } from "@angular/core";
import { BackendService } from "../../../../services/backend.service";
import { map } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class HomeService {
    constructor(private backendService: BackendService) { }

    // getPosts(limit:number = 0) {
    //     return this.backendService.get('post', {params: {limit}}), map((result: any) => {
    //         return result?.list ?? [];
    //     });
    // }

}