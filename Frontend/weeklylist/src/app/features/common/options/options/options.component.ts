import { Component, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserRequestService } from 'src/app/common/api/http-requests/requests/user/user-request.service';
import { UserPropertyService } from 'src/app/common/api/user-property/user-property.service';
import { IUser } from 'src/app/common/interfaces/weeklylist';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrl: './options.component.css'
})
export class OptionsComponent {

  @ViewChild('cancelNotification', { static: true })
  cancelNotification: TemplateRef<any>;

  @ViewChild('setNotification', { static: true })
  setNotification: TemplateRef<any>;

  user : IUser

  constructor(private urs: UserRequestService, public modalService: NgbModal) {
    urs.getUser().subscribe(
      (data) => {
        this.user = data
      },
      (error) => {
        // Gestisci l'errore qui utilizzando il metodo "catch"
        console.error('Errore durante la richiesta dell\'utente:', error);
        // Puoi fare altre operazioni come mostrare un messaggio d'errore all'utente
      }
    );
  }

  toggleNotifications(): void {
    if (this.user) {
      const newValue = !this.user.notificationActived; // Inverti lo stato delle notifiche
      this.urs.setOptions(newValue).subscribe(
        (updatedUser) => {


          console.log("update user : " + updatedUser.digest)
          this.user = updatedUser; // Aggiorna i dati utente con le notifiche aggiornate
          if(newValue === true){
            this.modalService.open(this.setNotification)
          }else{
            this.modalService.open(this.cancelNotification)
          }
        },
        (error) => {
          console.error('Errore durante l\'aggiornamento delle notifiche:', error);
          // Puoi gestire l'errore qui come desideri
        }
      );
    }
  }



}
