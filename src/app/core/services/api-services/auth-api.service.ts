import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { LoginRequest, LoginResponse } from '../../models/auth.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {
  private readonly endpoint = "/auth"

  constructor(private baseApiService: BaseApiService) { }

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.baseApiService.post<LoginResponse>(`${this.endpoint}/login`, payload);
  }

  refreshToken(refreshToken: string): Observable<LoginResponse> {
    return this.baseApiService.post<LoginResponse>(`${this.endpoint}/refresh`, JSON.stringify(refreshToken));
  }
}
