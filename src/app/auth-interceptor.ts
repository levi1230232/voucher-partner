import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('tool_token');
  const router = inject(Router);
  let clonedRequest = req;

  if (token) {
    clonedRequest = req.clone({
      setHeaders: { tool_token: token },
    });
  }
  return next(clonedRequest).pipe(
    catchError((error) => {
      if (error.status === 401) {
        localStorage.removeItem('tool_token');
        router.navigate(['/login']);
      }

      return throwError(() => error);
    }),
  );
};
