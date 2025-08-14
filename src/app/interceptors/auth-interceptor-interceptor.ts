import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators';
import { AuthService } from '@auth0/auth0-angular';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>, 
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // Skip auth for public endpoints
  if (isPublicEndpoint(req.url)) {
    return next(req);
  }

  return auth.getAccessTokenSilently().pipe(
    mergeMap(token => {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return next(authReq);
    }),
    catchError(error => {
      if (error.status === 401) {
        auth.loginWithRedirect();
      }
      return throwError(() => error);
    })
  );
};


function isPublicEndpoint(url: string): boolean {
  const publicEndpoints = ['/auth'];
  return publicEndpoints.some(endpoint => url.includes(endpoint));
}
