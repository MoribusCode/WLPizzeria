import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AuthenticationRoutingModule } from './authentication-routing.module';
import { AuthScreenComponent } from './auth-screen/auth-screen.component';
import { LoginUserComponent } from './login-user/login-user.component';
import { SignupUserComponent } from './signup-user/signup-user.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    AuthScreenComponent,
    LoginUserComponent,
    SignupUserComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    AuthenticationRoutingModule,
    NgbModule
  ]
})
export class AuthenticationModule { }
