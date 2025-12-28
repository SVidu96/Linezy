import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { User } from '../../models/user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserApiService {
  private endpoint = "/user";

  constructor(private baseApiService: BaseApiService) { }

  getUser(): Observable<User> {
    return this.baseApiService.get<User>(this.endpoint);
  }
}
