// Importa Validators e AbstractControl
import { Component } from '@angular/core';
import { UserRequestService } from 'src/app/common/api/http-requests/requests/user/user-request.service';
import { WeeklylistRequestService } from 'src/app/common/api/http-requests/requests/weeklylist/weeklylist-request.service';
import { User } from 'src/app/common/interfaces/user';
import { IUser, weeklyCreation } from 'src/app/common/interfaces/weeklylist';
import Holidays from 'date-holidays';
import { environment } from 'src/environments/enviroment';
import { EmailNotificationService } from 'src/app/common/api/http-requests/requests/email-notification/email-notification.service';

@Component({
  selector: 'app-create-list',
  templateUrl: './create-list.component.html',
  styleUrls: ['./create-list.component.css'],
})
export class CreateListComponent {
  formData: weeklyCreation = {
    numberOfWorkers: [0, 0, 0, 0, 0, 0, 0],
    date: '',
    workers: [],
    sendNotifications: false
  };
  message: string = '';
  errorMessage: string = '';
  holidaysForCurrentYear: any[] = [];

  giorniPreferenze: number[] = [0, 0, 0, 0, 0, 0, 0];

  workers: IUser[] = [];

  dayLabels: string[] = [
    'Lunedì',
    'Martedì',
    'Mercoledì',
    'Giovedì',
    'Venerdì',
    'Sabato',
    'Domenica',
  ];

  mondays: Date[] = []; // Array per i lunedì

  constructor(
    private rus: UserRequestService,
    private rws: WeeklylistRequestService,
    private ens: EmailNotificationService
  ) {
    this.rus.getUsers().subscribe((workers: IUser[]) => {
      // Supponiamo che i dati dei lavoratori siano disponibili come array 'workers'
      this.workers = workers;
      console.log(this.workers);
    });

    const today = new Date();
    const currentDayOfWeek = today.getDay(); // 0 (Domenica) a 6 (Sabato)

    // Calcola il lunedì immediatamente successivo
    const nextClosestMonday = new Date(today);
    nextClosestMonday.setDate(today.getDate() + ((8 - currentDayOfWeek) % 7));
    this.mondays.push(nextClosestMonday);

    // Calcola i successivi 5 lunedì
    for (let i = 1; i <= 5; i++) {
      const nextMonday = new Date(nextClosestMonday);
      nextMonday.setDate(nextClosestMonday.getDate() + 7 * i);
      this.mondays.push(nextMonday);
    }

    // Calcola i 5 lunedì precedenti
    for (let i = 1; i <= 5; i++) {
      const prevMonday = new Date(nextClosestMonday);
      prevMonday.setDate(nextClosestMonday.getDate() - 7 * i);
      this.mondays.unshift(prevMonday);
    }
  }

  onSubmit() {
    this.formData.numberOfWorkers = this.giorniPreferenze;

    console.log('Numero di lavoratori:', this.formData.numberOfWorkers);
    console.log('Data di inizio:', this.formData.date);
    console.log('ID dei lavoratori:', this.formData.workers);

    this.rws.postWeeklylist(this.formData).subscribe(
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
          "Nuova Bozza Disponibile del giorno " + `${startGiorno}/${startMese} - ${endGiorno}/${endMese}` +" su Weeklylist - Visualizzala Ora"

        const testoNotifica =
          'Siamo lieti di annunciarti che una nuova bozza è ora disponibile per la tua revisione su Weeklylist. Per visualizzarla e fornirci il tuo feedback, ti invitiamo a cliccare sul seguente link:';

        // Controlla se l'input checkbox è selezionato prima di inviare la notifica
        if (this.formData.sendNotifications) {
          this.ens
            .sendNotification(
              'metiupaga8@gmail.com',
              data.workers,
              soggettoNotifica,
              testoNotifica,
              environment.urlWebSite + "/admin-dashboard/book_weekly-list",
              environment.urlWebSite + "/user-dashboard/book_weekly-list"
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
        }

        this.message = 'Lista creata';
      },
      (error) => {
        // Gestisci l'errore qui
        console.error('Errore durante la chiamata postWeeklylist:', error);

        // Puoi anche mostrare un messaggio d'errore all'utente, se necessario
        this.errorMessage = error.errormessage;
      }
    );
    // Esegui le azioni desiderate quando il form viene inviato
  }


  addWorker(worker: IUser) {
    if (!this.formData.workers.includes(worker._id)) {
      this.formData.workers.push(worker._id);
    }
  }

  getWorkerName(workerId: string): string {
    const worker = this.workers.find((w) => w._id === workerId);
    return worker ? `${worker.firstName} ${worker.lastName}` : '';
  }

  removeWorker(worker: string): void {
    // Rimuovi il lavoratore dagli array "Lavoratori Selezionati" e "Lavoratori da Selezionare"
    this.formData.workers = this.formData.workers.filter((w) => w !== worker);
  }

  onDateChange(): void {
    const hd = new Holidays('IT'); // Sostituisci 'IT' con il codice del tuo paese
    const currentYear = new Date().getFullYear();

    const startYear = new Date(this.formData.date).getFullYear();
    const newEndOfWeek = new Date(this.formData.date); // Clona la data di inizio settimana
    newEndOfWeek.setDate(newEndOfWeek.getDate() + 6);

    const endYear = newEndOfWeek.getFullYear();

    // Ottieni le festività per l'anno dello start date con nomi nella lingua preferita (italiano in questo caso)
    const holidaysForStartYear = hd.getHolidays(startYear, 'it');

    // Se lo start date e l'end date sono nello stesso anno, usa lo stesso array di festività
    if (startYear === endYear) {
      this.holidaysForCurrentYear = holidaysForStartYear.filter((holiday) =>
        this.isDateInCurrentWeek(
          new Date(holiday.date),
          new Date(this.formData.date)
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
          new Date(this.formData.date)
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
