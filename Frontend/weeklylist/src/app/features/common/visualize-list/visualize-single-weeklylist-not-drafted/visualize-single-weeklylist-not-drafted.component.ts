import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IWeeklyList } from 'src/app/common/interfaces/weeklylist';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Holidays from 'date-holidays';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

@Component({
  selector: 'app-visualize-single-weeklylist-not-drafted',
  templateUrl: './visualize-single-weeklylist-not-drafted.component.html',
  styleUrls: ['./visualize-single-weeklylist-not-drafted.component.css'],
})
export class VisualizeSingleWeeklylistNotDraftedComponent implements OnInit {
  weeklyList!: IWeeklyList; // Tipo dati da sostituire con la tua interfaccia
  EndDate : Date
  holidaysForCurrentYear: any[] = [];
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Estrai la stringa JSON dal parametro 'id' e decodificala in un oggetto
    const encodedWeeklyList = this.route.snapshot.params['id'];
    this.weeklyList = JSON.parse(decodeURIComponent(encodedWeeklyList));

    console.log(this.weeklyList);
    this.calculateHolidaysForCurrentYear()
    this.EndDate = new Date(this.weeklyList.StartDate);
    this.EndDate.setDate(this.EndDate.getDate() + 6);
    // Puoi ora utilizzare this.weeklyList per visualizzare i dati della lista settimanale
  }

  printPDF() {
    const doc = new jsPDF();
    const startDateString = this.weeklyList.StartDate; // Suppongo che sia una stringa nel formato "YYYY-MM-DD"
    const startDate = new Date(startDateString);

    // Calcola la data di fine settimana aggiungendo 6 giorni alla data di inizio
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);

    // Formatta le date con il nome completo del giorno della settimana
    const options = {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    } as Intl.DateTimeFormatOptions;
    const formattedStartDate = startDate.toLocaleDateString('it-IT', options);
    const formattedEndDate = endDate.toLocaleDateString('it-IT', options);

    doc.setFontSize(16); // Imposta la dimensione del font per il titolo
    doc.text(
      `Elenco Settimanale da ${formattedStartDate} a ${formattedEndDate}`,
      105,
      10,
      { align: 'center' }
    );

    doc.setFontSize(10); // Imposta la dimensione del font per la legenda
    doc.text('Legenda: X* = Macchina propria, X = Macchina pizzeria', 105, 16, {
      align: 'center',
    }); // Modifica le coordinate x e y in base alla posizione desiderata

    // Prepara i dati e gli headers
    const uniqueWorkers = [
      ...new Set(
        this.weeklyList.weeklyList.flatMap((dailyList) =>
          dailyList.workerList.map(
            (worker) => `${worker.user.firstName} ${worker.user.lastName}`
          )
        )
      ),
    ];

    const headers = [
      'Nome',
      ...this.weeklyList.weeklyList.map((dailyList) => {
        const date = new Date(dailyList.day);
        const options = {
          day: '2-digit',
          month: '2-digit',
        } as Intl.DateTimeFormatOptions;
        return date.toLocaleDateString(undefined, options);
      }),
      'Tot. Serate',
    ];

    const data = [];
    // Aggiungi la riga "Lavoratori/giorno" in cima ai dati
    const workersPerDay = this.weeklyList.weeklyList.map((dailyList) =>
      dailyList.workerList.length.toString()
    );
    data.push(['N° Persone', ...workersPerDay, '', '']);

    // Aggiungi le righe degli utenti
    uniqueWorkers.forEach((workerName) => {
      const row = [workerName];
      let totalPropria = 0;
      let totalPizzacar = 0;

      this.weeklyList.weeklyList.forEach((dailyList) => {
        const worker = dailyList.workerList.find(
          (w) => `${w.user.firstName} ${w.user.lastName}` === workerName
        );
        if (worker) {
          if (worker.useHisCar) {
            row.push('X*');
            totalPropria += 1;
          } else {
            row.push('X');
            totalPizzacar += 1;
          }
        } else {
          row.push('');
        }
      });

      let autoText = '';
      if (totalPizzacar > 0) {
        autoText += totalPizzacar.toString() + ' ';
      }
      if (totalPropria > 0) {
        if (autoText !== '') {
          autoText += '+ ';
        }
        autoText += totalPropria.toString() + ' Macchina propria';
      }
      row.push(autoText);

      data.push(row);
    });

    autoTable(doc, {
      head: [headers],
      body: data,
      startY: 20,
      styles: {
        fontSize: 10,
        minCellHeight: 5,
        halign: 'center',
        valign: 'middle',
        lineWidth: 0.3, // Imposta lo spessore del bordo qui
        lineColor: [64, 64, 64], // Colore del bordo (grigio scuro)
      },
      didDrawCell: (data) => {
        // Aggiungi un bordo alle celle
        doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height);
      },
    });

    doc.save(`elenco-settimanale-${formattedStartDate}.pdf`);
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

  translateDayName(date: Date): string {
    const dayName = format(new Date(date), 'EEEE', { locale: it });
    return dayName.charAt(0).toUpperCase() + dayName.slice(1);
  }
}
