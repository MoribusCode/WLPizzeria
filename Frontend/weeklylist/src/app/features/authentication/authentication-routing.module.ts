import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthScreenComponent } from './auth-screen/auth-screen.component';
import { LoginUserComponent } from './login-user/login-user.component';
import { isAuthGuard } from 'src/app/common/guards/is-auth.guard';

const routes: Routes = [
  {
    path: '',
    component: AuthScreenComponent,
    canActivate: [isAuthGuard],
    canActivateChild: [isAuthGuard],
    children: [
      { path: 'login', component: LoginUserComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }
