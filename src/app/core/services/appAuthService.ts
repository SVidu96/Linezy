import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Observable, from, map, of, switchMap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

export interface DecodedToken {
  [key: string]: any;
  permissions?: string[];
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: string[]; // Auth0 custom roles claim
}

@Injectable({
  providedIn: 'root'
})
export class AppAuthService {
  private decodedTokenCache?: DecodedToken;

  constructor(public auth: AuthService) {}

  login() {
    this.auth.loginWithRedirect();
  }

  logout() {
    this.auth.logout({
      logoutParams: { returnTo: window.location.origin }
    });
  }

  getAccessToken(): Observable<string> {
    return this.auth.getAccessTokenSilently();
  }

  getUser() {
    return this.auth.user$;
  }

  isAuthenticated(): Observable<boolean> {
    return this.auth.isAuthenticated$;
  }

  /** Decode and cache token */
  private decodeToken(): Observable<DecodedToken | null> {
    if (this.decodedTokenCache) {
      return of(this.decodedTokenCache);
    }

    return this.getAccessToken().pipe(
      map(token => {
        if (!token) return null;
        try {
          const decoded = jwtDecode<DecodedToken>(token);
          this.decodedTokenCache = decoded;
          return decoded;
        } catch {
          return null;
        }
      })
    );
  }

  /** Get roles from token */
  getRoles(): Observable<string[]> {
    return this.decodeToken().pipe(
      map(decoded => decoded?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ?? [])
    );
  }

  /** Get permissions from token */
  getPermissions(): Observable<string[]> {
    return this.decodeToken().pipe(
      map(decoded => decoded?.permissions ?? [])
    );
  }

  /** Check if user has a specific role */
  hasRole(role: string): Observable<boolean> {
    return this.getRoles().pipe(map(roles => roles.includes(role)));
  }

  /** Check if user has a specific permission */
  hasPermission(permission: string): Observable<boolean> {
    return this.getPermissions().pipe(map(perms => perms.includes(permission)));
  }
}
