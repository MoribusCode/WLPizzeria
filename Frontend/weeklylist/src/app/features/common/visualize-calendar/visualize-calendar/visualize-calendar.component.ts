import { Component, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { CalendarEvent, CalendarMonthViewDay } from 'angular-calendar';
import { addMonths, subMonths } from 'date-fns';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserPropertyService } from 'src/app/common/api/user-property/user-property.service';
import { CalendarRequestService } from 'src/app/common/api/http-requests/requests/calendar/calendar-request.service';
import { ICalendarEvent } from 'src/app/common/interfaces/calendar';



@Component({
  selector: 'app-visualize-calendar',
  templateUrl: './visualize-calendar.component.html',
  styleUrls: ['./visualize-calendar.component.css'],
})
export class VisualizeCalendarComponent implements OnInit {
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];
  view: string = 'month';
  confirmationMessage: string = '';
  isLoading: boolean = true;


  @ViewChild('confirmModal', { static: true })
  confirmModalContent!: TemplateRef<any>;

  @ViewChild('removeBookingModal', { static: true })
  removeBookingModalContent!: TemplateRef<any>;

  constructor(
    public modalService: NgbModal,
    private ups: UserPropertyService,
    private crs: CalendarRequestService
  ) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  eventiDelCalendario : ICalendarEvent[] = []

  loadEvents() {
    this.isLoading = true;

    this.crs.getAllEvents().subscribe(
      (response) => {
        if (!response.error) {
          this.events = response.flatMap((calendarEvent: ICalendarEvent) => {
            return calendarEvent.users.map((user) => ({
              title: user._id, // Nome dell'utente prenotato
              start: new Date(calendarEvent.date),
              allDay: true,
              color: {
                primary: '#ad2121',
                secondary: '#FAE3E3',
              },
            }));
          });
        } else {
          console.error(response.errormessage);
          // Gestisci l'errore come preferisci.
        }
        this.eventiDelCalendario = response
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching events:', error);
        this.isLoading = false;
        // Gestisci l'errore come preferisci.
      }
    );
  }

  getUserNameFromId(userId: string): string {
    const userEvent = this.eventiDelCalendario.find((event) =>
      event.users.some((user) => user._id === userId)
    );

    if (userEvent) {
      // Trovato l'evento che contiene l'utente, restituisci il nome
      const user = userEvent.users.find((user) => user._id === userId);
      return user ? user.firstName  +" " +user.lastName : 'Nome non trovato';
    } else {
      return 'Utente non trovato';
    }
  }

  prevMonth(): void {
    this.viewDate = subMonths(this.viewDate, 1);
  }

  nextMonth(): void {
    this.viewDate = addMonths(this.viewDate, 1);
  }

  selectedDay!: CalendarMonthViewDay;
  selectedDayEvents: CalendarEvent[] = [];

  onDayClicked({
    day,
    sourceEvent,
  }: {
    day: CalendarMonthViewDay;
    sourceEvent: MouseEvent | KeyboardEvent;
  }) {
    this.selectedDay = day;
    this.selectedDayEvents = this.events.filter(
      (event) => event.start.toDateString() === this.selectedDay.date.toDateString()
    );

    if (this.isUserBookedForTheDay()) {
      this.askToRemoveBooking();
    } else {
      this.open(this.confirmModalContent);
    }
  }

  askToRemoveBooking() {
    this.modalService.open(this.removeBookingModalContent);
  }

  removeBooking() {
    const userId = this.ups.getId();
    this.crs.removeBooking(this.selectedDay.date, userId).subscribe(
      (response) => {
        if (!response.error) {
          // Rimuovi l'evento associato all'utente di quel giorno
          this.events = this.events.filter(
            (event) => !(event.start.toDateString() === this.selectedDay.date.toDateString() && event.title === userId)
          );
          this.selectedDayEvents = this.selectedDayEvents.filter(
            (event) => event.title !== userId
          );
        } else {
          console.error(response.errormessage);
        }
        this.modalService.dismissAll();
      },
      (error) => {
        console.error('Error removing the booking:', error);
      }
    );
  }



  isUserBookedForTheDay(): boolean {
    const selectedDate = this.selectedDay.date.toDateString();

    // Verifica se ci sono eventi per il giorno selezionato
    const eventsForSelectedDay = this.events.filter(
      (event) => event.start.toDateString() === selectedDate
    );

    // Verifica se l'utente è presente in almeno uno degli eventi
    return eventsForSelectedDay.some((event) => event.title === this.ups.getId());
  }


  open(content: any) {
    this.modalService.open(content, { size: 'lg' });
  }

  bookingName: string = '';
  isBookingInProgress: boolean = false;

  confirmBooking() {
    const newEvent: CalendarEvent = {
      title: this.ups.getId(),
      start: this.selectedDay.date,
      allDay: true,
      color: {
        primary: '#ad2121',
        secondary: '#FAE3E3',
      },
    };

    this.isBookingInProgress = true;
    this.modalService.dismissAll();

    this.crs.bookEvent(this.selectedDay.date).subscribe(
      (response) => {
        this.isBookingInProgress = false;
        if (!response.error) {
          this.events = [...this.events, newEvent];
          this.selectedDayEvents = [...this.selectedDayEvents, newEvent];
          this.confirmationMessage = `Prenotazione confermata per ${this.ups.getId()} il giorno ${this.selectedDay.date.toLocaleDateString()}`;
        } else {
          console.error(response.errormessage);
          // Gestisci l'errore come preferisci.
        }


      },
      (error) => {
        console.error('Error booking the event:', error);
        this.isBookingInProgress = false;
        // Gestisci l'errore come preferisci.
      }
    );
  }
}
