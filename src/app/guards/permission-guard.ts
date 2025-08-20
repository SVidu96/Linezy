// permission.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AppAuthService } from '../core/services/appAuthService';

export const permissionGuard: CanActivateFn = (route, state) => {
  const authService = inject(AppAuthService);
  const router = inject(Router);

  // required permissions passed from route data
  const requiredPermissions: string[] = route.data?.['permissions'] ?? [];

  return authService.getPermissions().pipe(
    map((permissions) => {
      if (!requiredPermissions.length) {
        return true; // no restriction, allow access
      }

      const hasPermission = requiredPermissions.every(p =>
        permissions.includes(p)
      );

      if (hasPermission) {
        return true;
      }

      // redirect to "forbidden" or login if not allowed
      router.navigate(['/forbidden']);
      return false;
    })
  );
};
