import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserPropertyService } from 'src/app/common/api/user-property/user-property.service';
import { SigninService } from 'src/app/common/api/http-requests/requests/auth/signin.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-login-user',
  templateUrl: './login-user.component.html',
  styleUrls: ['./login-user.component.css']
})
export class LoginUserComponent implements OnInit {
  email: string = '';
  password: string = '';
  errmessage: string = '';
  showModal: boolean = false;
  sessionExpiredMessage: string = '';
  redirectUrl: string | null = null;

  constructor(
    private ars: SigninService,
    private router: Router,
    private ups: UserPropertyService,
    private route: ActivatedRoute,
    public modalService: NgbModal
  ) {}
  @ViewChild('tokenExpiredModal', { static: true }) tokenExpiredModal!: TemplateRef<any>;

  ngOnInit(): void {
    this.route.queryParams.subscribe((queryParams) => {
      if(queryParams['sessionExpired'] === 'true' ){
        this.sessionExpiredMessage = 'Sessione scaduta'

        this.modalService.open(this.tokenExpiredModal)
      }
      if (queryParams['redirectUrl']) {
        this.redirectUrl = decodeURIComponent(queryParams['redirectUrl']);
      }
    });
  }

  closeModal() {
    this.modalService.dismissAll();
  }


  login() {
    this.ars.login(this.email, this.password).subscribe({
      next: async (d) => {
        console.log('Login effettuato: ' + JSON.stringify(d));

        if (this.redirectUrl) {
          this.router.navigateByUrl(this.redirectUrl);
        } else if (this.ups.getIsOwner()) {
          this.router.navigate(['/admin-dashboard']);
        } else {
          this.router.navigate(['/user-dashboard']);
        }

        this.errmessage = "";
      },
      error: (err) => {
        console.log('Errore nel login: ' + JSON.stringify(err));
        this.errmessage = err.error.message;
      }
    });
  }
}
