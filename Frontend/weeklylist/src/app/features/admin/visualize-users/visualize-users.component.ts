import { Component } from '@angular/core';
import { UserRequestService } from 'src/app/common/api/http-requests/requests/user/user-request.service';
import { UserPropertyService } from 'src/app/common/api/user-property/user-property.service';
import { IUser } from 'src/app/common/interfaces/weeklylist';

@Component({
  selector: 'app-visualize-users',
  templateUrl: './visualize-users.component.html',
  styleUrls: ['./visualize-users.component.css']
})
export class VisualizeUsersComponent {

  users : IUser[] = []

  constructor(private urs : UserRequestService, private ups : UserPropertyService){

    urs.getUsers().subscribe((data) => {
      this.users = data
    })
  }

  deleteUser(userId: string): void {
    // Qui puoi chiamare il tuo servizio per eliminare l'utente
    this.urs.deleteUser(userId).subscribe(() => {
      // Dopo aver eliminato l'utente, puoi rimuoverlo dall'array 'users' o richiamare 'getUsers' per aggiornare la lista
      this.users = this.users.filter(user => user._id !== userId);
    });
  }

  isAdmin(){
    return this.ups.getIsOwner()
  }

  getSelfId(){
    return this.ups.getId()
  }
}
