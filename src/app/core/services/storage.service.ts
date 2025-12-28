import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly ACCESS_TOKEN_EXPIRY_KEY = 'access_token_expires';

  constructor() {}

  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  setAccessToken(token: string): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
  }

  getAccessTokenExpiry(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_EXPIRY_KEY);
  }

  setAccessTokenExpiry(expiry: string): void {
    localStorage.setItem(this.ACCESS_TOKEN_EXPIRY_KEY, expiry);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  setRefreshToken(token: string): void {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
  }

  clearStorage(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.ACCESS_TOKEN_EXPIRY_KEY);
  }
}
