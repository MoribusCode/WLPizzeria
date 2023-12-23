import { Injectable } from '@angular/core';
import { AuthenticatedRequest } from '../../authenticated-request';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
import { JwtService } from '../../../jwt/jwt.service';
import { UserPropertyService } from '../../../user-property/user-property.service';
import { map } from 'rxjs/operators';
import { IUser } from 'src/app/common/interfaces/weeklylist';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserRequestService extends AuthenticatedRequest{

  constructor(httpClient: HttpClient, jwtService : JwtService, ups : UserPropertyService, router : Router) {
    super(httpClient, jwtService, ups, router)
  }

  getUsers(): Observable<IUser[]> {
    return this.httpClient.get<{ error: boolean; errormessage: string; message: IUser[] }>(
      `${this.baseUrl}/users/`, super.create_options()
    ).pipe(
      map(response => response.message) // Estrarre solo la proprietà 'message'
    );
  }

  getUser(): Observable<IUser> {
    return this.httpClient.get<{ error: boolean; errormessage: string; message: IUser }>(
      `${this.baseUrl}/users/` + this.ups.getId(), super.create_options()
    ).pipe(
      map(response => response.message) // Estrarre solo la proprietà 'message' contenente i dati dell'utente
    );
  }

  postUsers(firstName : string, lastName : string, email : string): Observable<string> {
    return this.httpClient.post<{ error: boolean; errormessage: string; message: string }>(
      `${this.baseUrl}/users/`, {firstName : firstName, lastName : lastName, email : email }, super.create_options()
    ).pipe(
      map(response => response.message) // Estrarre solo la proprietà 'message'
    );
  }

  setOptions(value: boolean): Observable<any> {
    return this.httpClient.put<{error: boolean; data: IUser}>(
      `${this.baseUrl}/users/${this.ups.getId()}?options=${value}`,
      {}, // Puoi passare un corpo della richiesta se necessario
      super.create_options() // Assumi che create_options() crei le opzioni per la richiesta HTTP (ad es. impostare l'header con il token JWT)
    ).pipe(
      map((response) => response.data) // Restituisci la risposta completa dell'utente
    );
  }

  deleteUser(idu : string): Observable<string> {
    return this.httpClient.delete<{ error: boolean; errormessage: string; message: string }>(
      `${this.baseUrl}/users/${idu}`, super.create_options()
    ).pipe(
      map(response => response.message) // Estrarre solo la proprietà 'message'
    );
  }


}
