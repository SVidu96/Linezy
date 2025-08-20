import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { HttpClientService } from './http-client.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminTestApiService extends BaseApiService<any>{
  constructor(httpClient: HttpClientService) {
    super(httpClient);
    this.setEndpoint('api/AdminTest');
  }

  getAdminTests(): Observable<any[]> {
    return this.getAll();
  }

}
