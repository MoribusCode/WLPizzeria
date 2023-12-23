import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { JwtService } from '../../../jwt/jwt.service';
import { UserPropertyService } from '../../../user-property/user-property.service';
import { Router } from '@angular/router';
import { AuthenticatedRequest } from '../../authenticated-request';

interface Email {
  from: string; // Mittente
  to: string[]; // Array di destinatari
  subject: string; // Oggetto della notifica
  text: string; // Testo del messaggio
  urlAdmin: string,
  urlUser: string
}


@Injectable({
  providedIn: 'root'
})
export class EmailNotificationService extends AuthenticatedRequest{

  constructor(httpClient: HttpClient, jwtService : JwtService, ups : UserPropertyService, router : Router) {
    super(httpClient, jwtService, ups, router)
  }

  sendNotification(from: string, to: string[], subject: string, text: string, urlAdmin: string, urlUser: string): Observable<any> {
    // Crea un oggetto con i dati della notifica
    const notificationData: Email = {
      from: from,
      to: to,
      subject: subject,
      text: text,
      urlAdmin: urlAdmin,
      urlUser: urlUser
    };

    console.log(notificationData)

    return this.httpClient.post<any>(
      `${this.baseUrl}/notification`, // Sostituisci con l'endpoint corretto
      notificationData, // Invia i dati della notifica
      super.create_options()
    );
  }




}
