import { Component, ViewChild } from '@angular/core';
import { UserPropertyService } from 'src/app/common/api/user-property/user-property.service';
import { Router } from '@angular/router';
import { UserRequestService } from 'src/app/common/api/http-requests/requests/user/user-request.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IUser } from 'src/app/common/interfaces/weeklylist';

@Component({
  selector: 'app-navbar-user',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  @ViewChild('accessoNegato') accessoNegato;
  @ViewChild('accessoConsentito') accessoConsentito;
  @ViewChild('notificheDisabilitateManualmente') notificheDisabilitateManualmente;
  private user: IUser;

  constructor(
    private us: UserRequestService,
    private ups: UserPropertyService,
    private router: Router,
    private modalService: NgbModal,
  ) {
    this.getUserDetails();
  }
  logout() {
    this.ups.logout();
    this.router.navigate(['/authentication']);
  }
  home() {
    this.router.navigate(['/user-dashboard']);
  }
  userDashboard() {
    this.router.navigate(['/user-dashboard/user-features']);
  }

  options() {
    this.router.navigate(['/user-dashboard/options']);
  }

  getUserDetails() {
    this.us.getUser().subscribe(
      (userData) => {
        this.user = userData;
        //console.log('Utente recuperato:', this.user);
      },
      (error) => {
        console.error('Errore nel recupero dell\'utente:', error);
      }
    );
  }


}
