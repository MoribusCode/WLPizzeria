import { Injectable } from '@angular/core';
import { AuthenticatedRequest } from '../../authenticated-request';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
import { JwtService } from '../../../jwt/jwt.service';
import { map } from 'rxjs/operators';
import { UserPropertyService } from '../../../user-property/user-property.service';
import { IWeeklyList, PreferenceInterface, weeklyCreation } from 'src/app/common/interfaces/weeklylist';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class WeeklylistRequestService extends AuthenticatedRequest{


  constructor(httpClient: HttpClient, jwtService : JwtService, ups : UserPropertyService, router : Router) {
    super(httpClient, jwtService, ups, router)
  }

  postWeeklylist(week : weeklyCreation): Observable<any> {
    return this.httpClient.post<{ error: boolean; errormessage: string; message: any }>(
      `${this.baseUrl}/weeklylists`, week, super.create_options()
    ).pipe(
      map(response => response.message),
      catchError((error) => {
        // Gestisci l'errore qui o rilancialo
        console.error('Errore durante la chiamata postWeeklylist:', error);
        throw error.error; // Rilancia l'errore per gestirlo altrove, se necessario
      })
    );
  }

  getWeeklylistsDrafted(): Observable<IWeeklyList[]> {
    return this.httpClient.get<{ error: boolean; errormessage: string; message: any }>(
      `${this.baseUrl}/weeklylists?isDraft=true`, super.create_options()
    ).pipe(
      map(response => response.message)
    );
  }
  getWeeklylistsDraftedToCompute(): Observable<IWeeklyList[]> {
    return this.httpClient.get<{ error: boolean; errormessage: string; message: any }>(
      `${this.baseUrl}/weeklylists?isDraft=true&compute=true`, super.create_options()
    ).pipe(
      map(response => response.message)
    );
  }

  getWeeklylistsNotDrafted(): Observable<IWeeklyList[]> {
    return this.httpClient.get<{ error: boolean; errormessage: string; message: any }>(
      `${this.baseUrl}/weeklylists?isDraft=false`, super.create_options()
    ).pipe(
      map(response => response.message)
    );
  }


  calculateWeeklylist(idw: string, preferences: PreferenceInterface): Observable<any> {
    return this.httpClient.put<{ error: boolean; errormessage: string; message: any }>(
      `${this.baseUrl}/weeklylists/` + idw, preferences, super.create_options()
    ).pipe(
      map(response => response.message),
      catchError(error => throwError(error)) // Propaga l'errore senza alcuna modifica
    );
  }

  putPrenotation(idw: string, idd: string): Observable<IWeeklyList> {
    return this.httpClient.put<{ error: boolean; errormessage: string; message: any }>(
      `${this.baseUrl}/weeklylists/${idw}/prenotationDays/${idd}`, {}, super.create_options()
    ).pipe(
      map(response => response.message),
      catchError(error => throwError(error)) // Propaga l'errore senza alcuna modifica
    );
  }

  putWeeklyListModifications(weeklyList : IWeeklyList): Observable<IWeeklyList> {
    return this.httpClient.put<{ error: boolean; errormessage: string; data: any }>(
      `${this.baseUrl}/weeklylists/${weeklyList._id}/weeklylist`, weeklyList, super.create_options()
    ).pipe(
      map(response => response.data),
      catchError(error => throwError(error)) // Propaga l'errore senza alcuna modifica
    );
  }

  deleteWeeklyList(weeklyList : IWeeklyList): Observable<IWeeklyList> {
    return this.httpClient.delete<{ error: boolean; errormessage: string; data: any }>(
      `${this.baseUrl}/weeklylists/${weeklyList._id}`, super.create_options()
    ).pipe(
      map(response => response.data),
      catchError(error => throwError(error)) // Propaga l'errore senza alcuna modifica
    );
  }
}
