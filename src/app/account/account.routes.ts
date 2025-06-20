import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
// import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { environment } from "../../environments/environment.development";
import { roleGuard } from "./guards/role/role.guard";

const superAdmin = environment.superAdminRole;
const admin = environment.adminRole;

const routes: Routes = [{
  path: '',
  loadComponent: () => import('./account.component'),
  children: [
    {
      path: '', redirectTo: 'profile', pathMatch: 'full'
    },
    {
      path: 'profile', loadComponent: () => import('./components/profile/profile.component'),
      data: { breadcrumb: 'Perfil' }
    },
    {      
      path: 'categories',
      children: [
        {
          path: '',
          loadComponent: () => import('./components/categories/categories.component'),
        },
        {
          path: ':id',
          loadComponent: () => import('./components/categories/category/category.component'),
          data: { breadcrumb: 'Categoría', roles: [superAdmin, admin] },
        }
      ],
      data: { breadcrumb: 'Categorías', roles: [superAdmin, admin] },
      canActivate: [roleGuard],
    },
    {
      path: 'products',
      children: [
        {
          path: '',
          loadComponent: () => import('./components/products/products.component'),
        },
        {
          path: ':id',
          loadComponent: () => import('./components/products/product/product.component'),
          data: { breadcrumb: 'Producto', roles: [superAdmin, admin] },
        }
      ],
      data: { breadcrumb: 'Productos', roles: [superAdmin, admin] },
      canActivate: [roleGuard],
    },
    {
      path: 'roles', loadComponent: () => import('./components/roles/roles.component'),
      data: { breadcrumb: 'Roles', roles: [superAdmin] },
      canActivate: [roleGuard],
    },
    {
      path: 'users', loadComponent: () => import('./components/users/users.component'),
      data: { breadcrumb: 'Usuarios', roles: [superAdmin] },
      canActivate: [roleGuard],
    },
    {
      path: 'settings', loadComponent: () => import('./components/settings/settings.component'),
      data: { breadcrumb: 'Configuración' }
    },
    { 
      path: '**', redirectTo: 'profile', pathMatch: 'full'
    },
  ]
}];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  providers: [
    // provideHttpClient(withInterceptorsFromDi()),
  ],
  exports: [
    RouterModule,
  ],
})

export default class AccountRoutes {}