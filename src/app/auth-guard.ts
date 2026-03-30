import { CanActivateFn, Router } from '@angular/router';
import { Inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = Inject(Router);
  const token = localStorage.getItem('tool_token');
  if (token) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
