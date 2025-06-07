import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const numericIdGuard: CanActivateFn = (route) => {
  const id = +route.params['id'];
  const router = inject(Router);
  //console.log('Guard activated with id:', id);
  if (isNaN(id) || id < 1) {
    return router.createUrlTree(['/restaurants']);
  }
  return true;
};
