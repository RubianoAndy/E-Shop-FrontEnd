import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { map, Observable } from 'rxjs';

export const authGuard: CanActivateFn = (route, state): Observable<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiresAuth = route.data['requiresAuth'] || false;

  return authService.isAuthenticated().pipe(
    map(isAuthenticated => {
      if (isAuthenticated)
        return requiresAuth ? true : router.createUrlTree(['/']);
      else
        return requiresAuth ? router.createUrlTree(['sign-in']) : true;
    })
  );
};