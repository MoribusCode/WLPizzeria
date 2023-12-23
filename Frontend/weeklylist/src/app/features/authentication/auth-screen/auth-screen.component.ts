import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-screen',
  templateUrl: './auth-screen.component.html',
  styleUrls: ['./auth-screen.component.css']
})
export class AuthScreenComponent {
  constructor(private router: Router) {

  }



  navigateToLogin() {
    this.router.navigate(['/authentication/login']);
  }

}
