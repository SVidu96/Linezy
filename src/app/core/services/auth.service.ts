import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { LoginRequest, LoginResponse } from '../models/auth.model';
import { AuthApiService } from './api-services/auth-api.service';
import { StorageService } from './storage.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private authApiService: AuthApiService,
    private storageService: StorageService,
    private userService: UserService
  ) {}

  initAuth(): Observable<void> {
    const token = this.storageService.getAccessToken();
    if (!token) {
      this.logout();
      return of(void 0);
    }

    const expiry = this.storageService.getAccessTokenExpiry();
    const isExpired = !expiry || new Date(expiry).getTime() < Date.now();

    if (isExpired) {
      const refreshToken = this.storageService.getRefreshToken();
      if (refreshToken) {
        return this.refreshToken().pipe(
          switchMap(() => this.userService.loadCurrentUser()),
          tap(user => user && this.isAuthenticatedSubject.next(true)),
          catchError(() => {
            this.logout();
            return of(void 0);
          }),
          map(() => void 0)
        );
      } else {
        this.logout();
        return of(void 0);
      }
    } else {
      this.isAuthenticatedSubject.next(true);
      return this.userService.loadCurrentUser().pipe(
        catchError(() => of(void 0)),
        map(() => void 0)
      );
    }
  }

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.authApiService.login(payload).pipe(
      tap(response => this.validateLoginResponse(response)),
      tap(response => this.handleAuthSuccess(response)),
      catchError(error => {
        throw error;
      })
    );
  }

  refreshToken(): Observable<LoginResponse> {
    const refreshToken = this.storageService.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    return this.authApiService.refreshToken(refreshToken).pipe(
      tap(response => this.validateLoginResponse(response)),
      tap(response => this.handleAuthSuccess(response)),
      catchError(error => {
        this.logout();
        throw error;
      })
    );
  }

  hasValidAccessToken(): boolean {
    const token = this.storageService.getAccessToken();
    const expiry = this.storageService.getAccessTokenExpiry();

    if (!token || !expiry || expiry.trim() === '') {
      return false;
    }

    const expiryTime = new Date(expiry).getTime();
    return !isNaN(expiryTime) && expiryTime > Date.now();
  }

  logout(): void {
    this.storageService.clearStorage();
    this.userService.setCurrentUser(null);
    this.isAuthenticatedSubject.next(false);
  }

  private validateLoginResponse(response: LoginResponse): void {
    if (!response?.accessToken || !response?.refreshToken || !response?.accessTokenExpires) {
      throw new Error('Invalid response: missing required fields');
    }
  }

  private handleAuthSuccess(response: LoginResponse): void {
    this.storageService.setAccessToken(response.accessToken);
    this.storageService.setRefreshToken(response.refreshToken);
    this.storageService.setAccessTokenExpiry(response.accessTokenExpires);
    this.isAuthenticatedSubject.next(true);
  }
}
