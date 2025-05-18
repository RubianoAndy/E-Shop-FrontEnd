import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { RolesService } from '../../services/roles/roles.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const roleService = inject(RolesService);
  const router = inject(Router);
  
  const roles = route.data['roles'] as Array<any>;

  return roleService.getRole().pipe(
    map(role => {
      if (roles.includes(Number(role.roleId)))
        return true;
      else {
        router.navigate(['/account']);
        return false;
      }
    })
  );
};
