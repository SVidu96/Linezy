import { Injectable } from '@angular/core';
import { AdminTestApiService } from './api-services/admintest-api.service';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(private adminTestApiService: AdminTestApiService) {}

  getAdminTests():Observable<any> {
    return this.adminTestApiService.getAdminTests().pipe(
      map(data=>data.map(item=> item))//just to show how to use map
    )
  }
  
}