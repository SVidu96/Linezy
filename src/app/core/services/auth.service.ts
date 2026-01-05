import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { AuthApiService } from './api-services/auth-api.service';
import { StorageService } from './storage.service';
import { UserService } from './user.service';
import { LoginRequest, LoginResponse, SignupRequest } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly _isAuthenticated$ = new BehaviorSubject<boolean>(false);
  readonly isAuthenticated$ = this._isAuthenticated$.asObservable();//public attrb

  constructor(
    private authApiService: AuthApiService,
    private storageService: StorageService,
    private userService: UserService
  ) {}

  initAuth(): Observable<void> {
    if (!this.hasValidAccessToken()) {
      return this.tryRefreshOrLogout();
    }

    this._isAuthenticated$.next(true);

    return this.userService.loadCurrentUser().pipe(
      catchError(() => {
        this.clearAuthentication();
        return of(void 0);
      }),
      map(() => void 0)
    );
  }

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.authApiService.login(payload).pipe(
      tap(res => this.validateLoginResponse(res)),
      tap(res => this.handleAuthSuccess(res))
    );
  }

  signup(payload: SignupRequest): Observable<any> {
    return this.authApiService.signup(payload);
  }

  refreshToken(): Observable<LoginResponse> {
    const refreshToken = this.storageService.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    return this.authApiService.refreshToken(refreshToken).pipe(
      tap(res => this.validateLoginResponse(res)),
      tap(res => this.handleAuthSuccess(res))
    );
  }

  logout(): void {
    this.authApiService.logout().subscribe();
    this.clearAuthentication();
  }

  hasValidAccessToken(): boolean {
    const token = this.storageService.getAccessToken();
    const expiry = this.storageService.getAccessTokenExpiry();

    if (!token || !expiry) return false;

    return new Date(expiry).getTime() > Date.now();
  }

  // ---------------- private helpers ----------------

  private tryRefreshOrLogout(): Observable<void> {
    const refreshToken = this.storageService.getRefreshToken();
    if (!refreshToken) {
      this.clearAuthentication();
      return of(void 0);
    }

    return this.refreshToken().pipe(
      switchMap(() => this.userService.loadCurrentUser()),
      tap(() => this._isAuthenticated$.next(true)),
      catchError(() => {
        this.clearAuthentication();
        return of(void 0);
      }),
      map(() => void 0)
    );
  }

  private handleAuthSuccess(response: LoginResponse): void {
    this.storageService.setAccessToken(response.accessToken);
    this.storageService.setRefreshToken(response.refreshToken);
    this.storageService.setAccessTokenExpiry(response.accessTokenExpires);
    this._isAuthenticated$.next(true);
  }

  private validateLoginResponse(response: LoginResponse): void {
    if (!response?.accessToken || !response?.refreshToken || !response?.accessTokenExpires) {
      throw new Error('Invalid login response');
    }
  }

  private clearAuthentication(): void {
    this.storageService.clearStorage();
    this.userService.setCurrentUser(null);
    this._isAuthenticated$.next(false);
  }
}
