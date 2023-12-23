import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import Holidays from 'date-holidays';
import { Router } from '@angular/router';
import { WeeklylistRequestService } from 'src/app/common/api/http-requests/requests/weeklylist/weeklylist-request.service';
import { UserPropertyService } from 'src/app/common/api/user-property/user-property.service';
import { IWeeklyList } from 'src/app/common/interfaces/weeklylist';

@Component({
  selector: 'app-list-button',
  templateUrl: './list-button.component.html',
  styleUrls: ['./list-button.component.css'],
})
export class ListButtonComponent implements OnInit {
  @Input() weeklyList!: IWeeklyList; // Input per la lista settimanale
  @Input() url!: string; // Input per la lista settimanale
  @Input() isModified: boolean = false;
  @Output() listDeleted = new EventEmitter<IWeeklyList>();

  holidaysForCurrentYear: any[] = [];

  constructor(
    private router: Router,
    private ups: UserPropertyService,
    private rws: WeeklylistRequestService
  ) {}

  async ngOnInit(): Promise<void> {
    this.calculateHolidaysForCurrentYear();
  }

  redirectToWeeklyLists() {
    console.log('Redirecting to weekly-lists');

    // Converti la lista settimanale in una stringa JSON
    const weeklyListJSON = JSON.stringify(this.weeklyList);

    // Codifica la stringa JSON in modo che possa essere passata come parametro nell'URL
    const encodedWeeklyList = encodeURIComponent(weeklyListJSON);

    // Naviga alla pagina "weekly-lists" con il parametro "weeklyList"
    if (this.ups.getIsOwner()) {
      this.router.navigate(['/admin-dashboard/' + this.url, encodedWeeklyList]);
    } else {
      this.router.navigate(['/user-dashboard/' + this.url, encodedWeeklyList]);
    }
  }
  getEndDate(startDate: Date): Date {
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);
    return endDate;
  }

  deleteWeeklyList(weeklyList: IWeeklyList) {
    // Chiamata a un servizio o al backend per eliminare la lista settimanale
    // Puoi utilizzare il metodo "deleteWeeklyList" che hai già definito o crearne uno nuovo
    this.rws.deleteWeeklyList(weeklyList).subscribe(
      (response) => {
        // Gestisci la risposta di eliminazione
        console.log('Lista settimanale eliminata con successo', response);
        // Emetti l'evento listDeleted quando la lista è stata eliminata
        this.listDeleted.emit(weeklyList);
      },
      (error) => {
        // Gestisci gli errori in caso di fallimento dell'eliminazione
        console.error(
          "Errore durante l'eliminazione della lista settimanale",
          error
        );
        // Mostra un messaggio di errore o esegui altre azioni necessarie
      }
    );
  }
  getUpsValue(): any {
    return this.ups;
  }

  calculateHolidaysForCurrentYear(): void {
    const hd = new Holidays('IT'); // Sostituisci 'IT' con il codice del tuo paese
    const currentYear = new Date().getFullYear();

    const startYear = new Date(this.weeklyList.StartDate).getFullYear();
    const newEndOfWeek = new Date(this.weeklyList.StartDate); // Clona la data di inizio settimana
    newEndOfWeek.setDate(newEndOfWeek.getDate() + 6);

    const endYear = newEndOfWeek.getFullYear();

    // Ottieni le festività per l'anno dello start date con nomi nella lingua preferita (italiano in questo caso)
    const holidaysForStartYear = hd.getHolidays(startYear, 'it');

    // Se lo start date e l'end date sono nello stesso anno, usa lo stesso array di festività
    if (startYear === endYear) {
      this.holidaysForCurrentYear = holidaysForStartYear.filter((holiday) =>
        this.isDateInCurrentWeek(
          new Date(holiday.date),
          new Date(this.weeklyList.StartDate)
        )
      );
    } else {
      // Se lo start date e l'end date sono in anni diversi, ottieni le festività per entrambi gli anni
      const holidaysForEndYear = hd.getHolidays(endYear, 'it');

      // Combina le festività di entrambi gli anni
      const allHolidays = holidaysForStartYear.concat(holidaysForEndYear);

      // Filtra solo le festività della settimana corrente
      this.holidaysForCurrentYear = allHolidays.filter((holiday) =>
        this.isDateInCurrentWeek(
          new Date(holiday.date),
          new Date(this.weeklyList.StartDate)
        )
      );
    }

    console.log(this.holidaysForCurrentYear);
  }

  private isDateInCurrentWeek(date: Date, startOfWeek: Date): boolean {
    // Crea nuove date senza considerare l'ora, il minuto, il secondo e il fuso orario
    const newDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    const newStartOfWeek = new Date(
      startOfWeek.getFullYear(),
      startOfWeek.getMonth(),
      startOfWeek.getDate()
    );

    // Crea la data di fine della settimana aggiungendo 6 giorni alla data di inizio
    const newEndOfWeek = new Date(newStartOfWeek);
    newEndOfWeek.setDate(newEndOfWeek.getDate() + 6);

    // Confronta le nuove date
    return newDate >= newStartOfWeek && newDate <= newEndOfWeek;
  }

  isAdmin(): boolean{
    return this.ups.getIsOwner()
  }

  isUserInWorkersList(): boolean {
    const userId = this.ups.getId()
    return this.weeklyList.workers.some((worker) => worker._id === userId);
  }

  isListWatchable(): boolean {
    return this.isAdmin() || this.isUserInWorkersList()
  }


}
