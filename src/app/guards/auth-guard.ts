import { CanActivateFn, Router } from '@angular/router';
import { AppAuthService } from '../core/services/appAuthService';
import { inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

export const authGuard: CanActivateFn = async (route, state) => {
  const auth = inject(AppAuthService);
  const router = inject(Router);
  
  const isAuth = await firstValueFrom(auth.isAuthenticated());
  if (!isAuth) {
    auth.login();
    return false;
  }
  return true;
};

