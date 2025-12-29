import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { LoginRequest, LoginResponse, SignupRequest } from '../../models/auth.model';
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

  signup(payload: SignupRequest): Observable<any> {
    return this.baseApiService.post<any>(`${this.endpoint}/register`, payload);
  }

  refreshToken(refreshToken: string): Observable<LoginResponse> {
    return this.baseApiService.post<LoginResponse>(`${this.endpoint}/refresh`, JSON.stringify(refreshToken));
  }

  logout(): any {
    return this.baseApiService.get<any>(`${this.endpoint}/logout`);
  }
}
