import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AppAuthService {
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
}