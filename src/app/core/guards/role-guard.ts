import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { map, take } from 'rxjs/operators';

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return () => {
    const userService = inject(UserService);
    const router = inject(Router);
    return userService.currentUser$.pipe(
      take(1),
      map(user => {
        if (!user) {
          return router.createUrlTree(['/login']);
        }

        const hasRole = allowedRoles.some(role =>
          user.roles.includes(role)
        );

        if (!hasRole) {
          return router.createUrlTree(['/not-found']);
        }

        return true;
      })
    );
  };
};
