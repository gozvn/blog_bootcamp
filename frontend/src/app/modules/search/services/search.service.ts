import { Injectable } from '@angular/core';
import { BackendService } from '../../../services/backend.service';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  constructor(private backendService: BackendService) { }

  searchPosts(keyword: string, page: number = 1, limit: number = 10) {
    const params = {
      keyword: keyword,
      page: page,
      limit: limit
    };
    
    return this.backendService.get('public/search', { params }).pipe(
      map((result: any) => result?.data ?? null)
    );
  }

}