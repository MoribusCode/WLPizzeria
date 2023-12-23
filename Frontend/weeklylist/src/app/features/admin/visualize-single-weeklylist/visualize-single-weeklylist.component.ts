import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WeeklylistRequestService } from 'src/app/common/api/http-requests/requests/weeklylist/weeklylist-request.service';
import {
  IWeeklyList,
  IUser,
  UserPreference,
  PreferenceInterface,
  Worker,
} from 'src/app/common/interfaces/weeklylist';
import Holidays from 'date-holidays';
import { environment } from 'src/environments/enviroment';
import { EmailNotificationService } from 'src/app/common/api/http-requests/requests/email-notification/email-notification.service';

@Component({
  selector: 'app-visualize-single-weeklylist',
  templateUrl: './visualize-single-weeklylist.component.html',
  styleUrls: ['./visualize-single-weeklylist.component.css'],
})
export class VisualizeSingleWeeklylistComponent {
  weeklyList!: IWeeklyList; // Tipo dati da sostituire con la tua interfaccia
  workerDaysMap: Map<string, number> = new Map(); // Mappa per associare id lavoratore con giorni di lavoro

  userPrenotationCounts: Record<
    string,
    { count: number; firstName: string; lastName: string }
  > = {};

  holidaysForCurrentYear: any[] = [];
  errormessage: string = '';
  message: string = '';
  constructor(
    private route: ActivatedRoute,
    private wrs: WeeklylistRequestService,
    private router: Router,
    private ens: EmailNotificationService
  ) {}

  ngOnInit(): void {
    // Estrai la stringa JSON dal parametro 'id' e decodificala in un oggetto
    const encodedWeeklyList = this.route.snapshot.params['id'];
    this.weeklyList = JSON.parse(decodeURIComponent(encodedWeeklyList));
    this.calculateUserPrenotationCount();

    // Popola la mappa dei giorni di lavoro per ciascun lavoratore
    this.weeklyList.workers.forEach((workerId) => {
      // Assumi che workerId sia l'ID del lavoratore e giorniLavoro sia il numero di giorni che deve lavorare
      const giorniLavoro = 0; // Esempio, dovrai ottenere il valore reale da qualche parte
      this.workerDaysMap.set(workerId._id, giorniLavoro);
    });

    this.calculateHolidaysForCurrentYear();
    // Puoi ora utilizzare this.weeklyList e this.workerDaysMap come necessario
  }

  calculateUserPrenotationCount(): void {
    if (
      this.weeklyList &&
      this.weeklyList.prenotationDays &&
      this.weeklyList.workers
    ) {
      for (const prenotationDay of this.weeklyList.prenotationDays) {
        // Inizializza il conteggio per ogni utente a zero
        this.weeklyList.workers.forEach((worker) => {
          const userId = worker._id;
          if (!this.userPrenotationCounts[userId]) {
            this.userPrenotationCounts[userId] = {
              count: 0,
              firstName: worker.firstName,
              lastName: worker.lastName,
            };
          }
        });

        // Conta le prenotazioni per ciascun utente in questo PrenotationDay
        for (const user of prenotationDay.users) {
          const matchingWorker = this.weeklyList.workers.find(
            (worker) => worker._id === user._id
          );
          if (matchingWorker) {
            const userId = matchingWorker._id;
            this.userPrenotationCounts[userId].count++; // Incremento del conteggio
          }
        }
      }
    }
  }

  inviaMappa(): void {
    const preferences: UserPreference[] = [];
    for (const [workerId, dayAssigned] of this.workerDaysMap.entries()) {
      const userPreference: UserPreference = {
        user: workerId,
        dayAssigned: dayAssigned,
      };
      preferences.push(userPreference);
    }

    const preferenceInterface: PreferenceInterface = {
      preferences: preferences,
    };

    this.message = '';
    this.errormessage = '';

    this.wrs
      .calculateWeeklylist(this.weeklyList._id, preferenceInterface)
      .subscribe(
        (data) => {
          console.log('lista creata' + data);
          console.log('lista creata' + data);
          const startDataOra = new Date(data.StartDate);

          // Calcola la End Date aggiungendo un certo numero di giorni alla Start Date
          const giorniDurata = 7; // Modifica questo valore con la durata desiderata in giorni
          const endDataOra = new Date(startDataOra);
          endDataOra.setDate(startDataOra.getDate() + giorniDurata);

          // Estrai l'anno, il mese e il giorno per la Start Date
          const startAnno = startDataOra.getFullYear();
          const startMese = startDataOra.getMonth() + 1; // Il mese inizia da 0, quindi aggiungi 1
          const startGiorno = startDataOra.getDate();

          // Estrai l'anno, il mese e il giorno per la End Date
          const endAnno = endDataOra.getFullYear();
          const endMese = endDataOra.getMonth() + 1; // Il mese inizia da 0, quindi aggiungi 1
          const endGiorno = endDataOra.getDate();

          const soggettoNotifica =
          'Scopri la Nuova Lista su Weeklylist del ' + `${startGiorno}/${startMese} - ${endGiorno}/${endMese}` + '';


        const testoNotifica =
          'Siamo entusiasti di presentarti la nuova lista aggiornata disponibile su Weeklylist. Ti invitiamo a esplorarla e condividere le tue preziose opinioni con noi. Puoi accedere alla lista tramite il link qui sotto:';

          this.ens
            .sendNotification(
              'metiupaga8@gmail.com',
              data.workers,
              soggettoNotifica,
              testoNotifica,
              environment.urlWebSite + '/admin-dashboard/weekly-lists-not-drafted',
              environment.urlWebSite + '/user-dashboard/weekly-lists-not-drafted'
            )
            .subscribe(
              () => {
                console.log('Notifica inviata con successo');
                // Gestisci la risposta dell'invio della notifica se necessario
              },
              (error) => {
                console.error("Errore durante l'invio della notifica:", error);
                // Gestisci gli errori dell'invio della notifica se necessario
              }
            );
          this.message = 'Lista creata';
          this.router.navigate(['/admin-dashboard/weekly-lists-not-drafted']);
        },
        (error) => {
          this.errormessage = error.error.errormessage;
        }
      );
    // Stampa la mappa nella console
    console.log(this.workerDaysMap);
  }

  getUserIds(): string[] {
    return Object.keys(this.userPrenotationCounts);
  }

  getMaxWorkingDays(worker: IUser): number {
    // Ottieni il conteggio delle prenotazioni per l'utente associato al lavoratore
    const userCount = this.userPrenotationCounts[worker._id]?.count || 0;

    // Il massimo consentito sarà 7 meno il conteggio delle prenotazioni dell'utente
    return 7 - userCount;
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
}
