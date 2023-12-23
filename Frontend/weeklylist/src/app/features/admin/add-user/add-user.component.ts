import { Component } from '@angular/core';
import { UserRequestService } from 'src/app/common/api/http-requests/requests/user/user-request.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent {

  firstName : string = ""
  lastName : string = ""
  email : string = ""

  passwordMessage : string = ""

  constructor(private urs : UserRequestService){

  }

  createUser(){
    console.log(this.firstName + this.lastName + this.email)
    this.urs.postUsers(this.firstName, this.lastName, this.email).subscribe((data) => {
      this.passwordMessage = data
    })
  }
}
