import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WeeklylistRequestService } from 'src/app/common/api/http-requests/requests/weeklylist/weeklylist-request.service';
import { UserPropertyService } from 'src/app/common/api/user-property/user-property.service';
import { IWeeklyList, PrenotationDay } from 'src/app/common/interfaces/weeklylist';
import Holidays from 'date-holidays';

@Component({
  selector: 'app-book-single-weekly-list',
  templateUrl: './book-single-weekly-list.component.html',
  styleUrls: ['./book-single-weekly-list.component.css']
})
export class BookSingleWeeklyListComponent implements OnInit{
  weeklyList!: IWeeklyList; // Tipo dati da sostituire con la tua interfaccia
  EndDate : Date
  holidaysForCurrentYear: any[] = [];

  constructor(private route: ActivatedRoute, private wrs : WeeklylistRequestService, private router : Router, private ups : UserPropertyService) { }

  ngOnInit(): void {
    // Estrai la stringa JSON dal parametro 'id' e decodificala in un oggetto
    const encodedWeeklyList = this.route.snapshot.params['id'];
    this.weeklyList = JSON.parse(decodeURIComponent(encodedWeeklyList));

    this.EndDate = new Date(this.weeklyList.StartDate);
    this.EndDate.setDate(this.EndDate.getDate() + 6);
    console.log(this.weeklyList)
    this.calculateHolidaysForCurrentYear()
    // Puoi ora utilizzare this.weeklyList per visualizzare i dati della lista settimanale
  }

  prenotaGiorno(idWeeklyList: string, idDay: string) {
    // Effettua la chiamata HTTP per prenotare il giorno
    // Sostituisci 'url_api' con l'URL effettivo per la tua API
    const url = `url_api/prenota/${idWeeklyList}/${idDay}`;
    console.log(url)


    this.wrs.putPrenotation(idWeeklyList,idDay).subscribe(
      (response) => {
        this.weeklyList=response
        console.log('Prenotazione effettuata con successo', response);
        const weeklyListJSON = JSON.stringify(this.weeklyList);
        const encodedWeeklyList = encodeURIComponent(weeklyListJSON);

        if(this.ups.getIsOwner()){
          this.router.navigate(['/admin-dashboard/book_weekly-list', encodedWeeklyList]);
        }else{
          this.router.navigate(['/user-dashboard/book_weekly-list', encodedWeeklyList]);
        }

      },
      (error) => {

        console.error('Errore durante la prenotazione', error);
      }
    );

  }

  isDayPrenotable(prenotationDay: PrenotationDay): boolean {
    console.log("è prenotabile?", prenotationDay);

    // Calcola se il giorno è prenotabile
    const isPrenotable = this.calculateIsDayPrenotable(prenotationDay);

    // Verifica se il nome dell'utente appare nella lista dei lavoratori
    const userIsInWorkersList = this.isUserInWorkersList();

    // Ritorna true solo se il giorno è prenotabile e il nome dell'utente è nella lista dei lavoratori
    return isPrenotable && userIsInWorkersList;
  }

  private calculateIsDayPrenotable(prenotationDay: PrenotationDay): boolean {
    // Calcola il numero di persone prenotate per il giorno
    const numberOfPrenotatedUsers = prenotationDay.users.length;

    console.log("Numero di persone prenotate questo giorno " + prenotationDay.date + " : " + numberOfPrenotatedUsers);

    // Se numberOfWorker è uguale a 0, il giorno non è prenotabile
    if (prenotationDay.numberOfWorker === 0) {
      return false;
    }

    // Ottieni il numero massimo di lavoratori desiderato
    const maxWorkers = this.weeklyList.workers.length - prenotationDay.numberOfWorker;

    console.log("Numero di persone mancanti: " + maxWorkers);

    // Verifica se il giorno è prenotabile
    return maxWorkers > numberOfPrenotatedUsers;
  }

  isUserInWorkersList(): boolean {
    // Verifica se il nome dell'utente appare nella lista dei lavoratori
    return this.weeklyList.workers.some(worker => worker._id === this.ups.getId());
  }



  isUserPrenotated(prenotationDay: PrenotationDay): boolean {
    const currentUserID = this.ups.getId(); // Sostituisci con il tuo metodo per ottenere l'ID dell'utente corrente
    return prenotationDay.users.some(user => user._id === currentUserID);
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
