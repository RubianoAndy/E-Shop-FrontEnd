import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  var ignoreRoutes = [
    // '/refresh-token',     // Deja pasar la petición sin interceptarla, para evitar un bucle infinito
    '/sign-in',
    '/sign-out',
    '/register',
    '/activate',
    '/generate-code',
    '/verify-code',
    '/send-contact',

    '/categories-small',
  ];

  if (req.url.includes('/refresh-token')) {
    return next(req).pipe(
      catchError((err: any) => {
        if (err.status === 401) {
          // authService.signOut();
          authService.deleteTokens();
        }

        return throwError(() => ({
          status: err.status,
          message: err.error?.message || 'Error al refrescar el token',
          error: err.error || null,
        }));
      })
    );
  }

  if (ignoreRoutes.some(route => req.url.includes(route)))
    return next(req);

  const accessToken = authService.getAccessToken();
  const request = req.clone({
    setHeaders: {
      Authorization: `Bearer ${accessToken}`,
    }
  });

  return next(request).pipe(
    catchError((err: any) => {
      if (err.status === 401) {
        return authService.refreshToken().pipe(
          switchMap(response => {
            authService.setAccessToken(response.accessToken);
            const newRequest = req.clone({
              setHeaders: {
                Authorization: `Bearer ${response.accessToken}`,
              }
            });

            return next(newRequest);
          }),
          catchError(error => {
            authService.signOut();
            // authService.deleteTokens();
            // return throwError(() => new Error(error)); // Propaga el error

            return throwError(() => ({
              status: error.status,
              message: error.error?.message || 'Error al refrescar el token',
              error: error.error || null,
            }));
          })
        );
      }
      // return throwError(() => new Error(err)); // Propaga el error

      return throwError(() => ({
        status: err.status,
        message: err.error?.message || 'Error desconocido',
        error: err.error || null,
      }));
    })
  );
};
