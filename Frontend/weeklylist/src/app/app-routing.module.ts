import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './common/guards/auth.guard';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { roleGuard } from './common/guards/role.guard';

const routes: Routes = [
  {
    path: 'admin-dashboard',
    loadChildren: () => import('./features/admin/admin.module').then((m) => m.AdminModule),
    canActivate: [authGuard, roleGuard],
    data: { isOwner: true }
  },
  {
    path: 'user-dashboard',
    loadChildren: () => import('./features/user/user.module').then((m) => m.UserModule),
    canActivate: [authGuard, roleGuard],
    data: { isOwner: false }
  },
  {
    path: 'authentication',
    loadChildren: () => import('./features/authentication/authentication.module').then((m) => m.AuthenticationModule)
  },
  {
    path: 'permission-denied',
    loadChildren: () => import('./features/permission-denied/permission-denied.module').then((m) => m.PermissionDeniedModule)
  },
  {
    path: '**',
    redirectTo: '/authentication/login',
    pathMatch: 'full'
  },
];


@NgModule({
  imports: [RouterModule.forRoot(routes), NgbModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
