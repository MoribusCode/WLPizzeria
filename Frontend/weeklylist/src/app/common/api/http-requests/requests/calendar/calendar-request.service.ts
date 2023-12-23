import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { JwtService } from '../../../jwt/jwt.service';
import { UserPropertyService } from '../../../user-property/user-property.service';
import { AuthenticatedRequest } from '../../authenticated-request';
import { ICalendarEvent } from 'src/app/common/interfaces/calendar';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CalendarRequestService extends AuthenticatedRequest{

  constructor(httpClient: HttpClient, jwtService : JwtService, ups : UserPropertyService, router : Router) {
    super(httpClient, jwtService, ups, router)
  }

  getAllEvents(): Observable<any> {
    return this.httpClient.get<{ error: boolean; errormessage: string; message: ICalendarEvent[] }>(
      `${this.baseUrl}/events`, super.create_options()
    ).pipe(
      map(response => response.message)
    );
  }

  bookEvent(eventId: Date): Observable<any> {
    return this.httpClient.put<{ error: boolean; errormessage: string; message: any }>(
      `${this.baseUrl}/events?action=book`, { eventId: eventId }, super.create_options()
    ).pipe(
      map(response => response.message)
    );
  }

  removeBooking(eventId: Date, userId: string): Observable<any> {
    return this.httpClient.put<{ error: boolean; errormessage: string; message: any }>(
      `${this.baseUrl}/events?action=unbook`, { eventId: eventId, userId: userId }, super.create_options()
    ).pipe(
      map(response => response.message)
    );
  }


}
