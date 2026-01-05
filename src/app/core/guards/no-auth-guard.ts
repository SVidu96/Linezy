import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { RoutePath } from '../../app.routes';

export const noAuthGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);

  if(userService.getCurrentUser()) {
    return router.createUrlTree([RoutePath.Home])
  }

  return true;
};
