import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthUsersService } from '../../auth/services/users.service';
import { map } from 'rxjs/operators';

export const logoutActivateGuard: CanActivateFn = () => {
  const authService = inject(AuthUsersService);
  const router = inject(Router);

  return authService.validateToken().pipe(
    map((isValid) => isValid ? router.createUrlTree(['/restaurants']) : true)
  );
};
