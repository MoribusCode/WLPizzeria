import { Component } from '@angular/core';
import { UserPropertyService } from 'src/app/common/api/user-property/user-property.service';

@Component({
  selector: 'app-owner-dashboard',
  templateUrl: './owner-dashboard.component.html',
  styleUrls: ['./owner-dashboard.component.css']
})
export class OwnerDashboardComponent {

  constructor(private urs: UserPropertyService) {}

  getPerson(){
    return this.urs
  }
}
