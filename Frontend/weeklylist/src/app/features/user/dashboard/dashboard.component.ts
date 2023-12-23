import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { UserRequestService } from 'src/app/common/api/http-requests/requests/user/user-request.service';
import { WeeklylistRequestService } from 'src/app/common/api/http-requests/requests/weeklylist/weeklylist-request.service';
import { UserPropertyService } from 'src/app/common/api/user-property/user-property.service';
import { IWeeklyList } from 'src/app/common/interfaces/weeklylist';
import Chart from 'chart.js/auto';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  public timesWorked: any[] = [];
  public monthlyWorked: any[] = []; // Array per contenere il numero di giorni lavorati per mese
  public monthlyWorkedObject: any = {}; // Oggetto per contenere il numero di giorni lavorati per mese e giorno della settimana

  @ViewChild('myPieChart2') myPieChart2: ElementRef;
  @ViewChild('myPieChart3') myPieChart3: ElementRef;

  @ViewChild('myChart') myChart: ElementRef;
  public daysOfWeekData: { [dayOfWeek: string]: number }[] = []; // Variabile per i dati dei giorni della settimana

  constructor(
    private urs: UserPropertyService,
    private rws: WeeklylistRequestService,
  ) {}

  ngOnInit(): void {
    // Effettua la richiesta per ottenere le IWeeklylist non elaborate
    this.rws.getWeeklylistsNotDrafted().subscribe(
      (data) => {
        // Gestisci i dati ricevuti qui
        console.log('Dati ricevuti:', data);

        // Ora estrai le volte in cui hai lavorato
        this.timesWorked = this.getTimesWorked(data).timesWorked;
        this.monthlyWorkedObject =
          this.getTimesWorked(data).monthlyWorkedObject;

        console.log(this.timesWorked);
        console.log(this.monthlyWorkedObject);

        // Calcola il numero di giorni lavorati per ogni mese
        this.calculateMonthlyWorked();
        console.log(this.monthlyWorked);

        // Calcola il numero di giorni della settimana per gli ultimi 4 mesi
        console.log(this.daysOfWeekData);

        // Inizializza il grafico o effettua altre elaborazioni
        this.initializeChart();
        this.initializePieCharts();
      },
      (error) => {
        // Gestisci eventuali errori qui
        console.error('Errore durante la richiesta:', error);
      }
    );
  }

  private getTimesWorked(weeklyLists: IWeeklyList[]): {
    timesWorked: any[];
    monthlyWorkedObject: any;
  } {
    const timesWorked = [];
    const monthlyWorkedObject = {};

    // Ottieni l'ID utente corrente da this.urs.getId()
    const currentUserId = this.urs.getId();

    // Inizializza un oggetto per tenere traccia dei giorni lavorati per ogni mese e giorno della settimana

    // Itera attraverso ciascuna IWeeklylist
    for (const weeklyList of weeklyLists) {
      // Estrai l'array di DailyList da ciascuna IWeeklylist
      const dailyList = weeklyList.weeklyList; // Assumendo che "weeklyList" contenga l'array "dailyList"

      // Verifica se la struttura dati contiene un array di Worker con il campo _id
      if (dailyList && Array.isArray(dailyList) && dailyList.length > 0) {
        // Itera attraverso l'array di DailyList
        for (const daily of dailyList) {
          // Estrai la data (giorno) dalla DailyList
          const day = new Date(daily.day);

          // Verifica se l'ID utente corrente è uguale all'ID utente di un lavoratore in questa giornata
          const worker = daily.workerList.find(
            (worker) => worker.user._id === currentUserId
          );

          if (worker) {
            // Se il lavoratore ha lavorato in questa giornata, aggiungi le informazioni desiderate
            timesWorked.push({
              date: day,
              // Altre informazioni che vuoi aggiungere
            });

            // Calcola il giorno della settimana (0 = Domenica, 1 = Lunedì, ..., 6 = Sabato)
            const dayOfWeek = day.getDay();

            // Crea una chiave unica per il mese e il giorno della settimana
            const monthYearKey = `${day.getMonth()}-${day.getFullYear()}`;
            const dayOfWeekKey = `day${dayOfWeek}`;

            // Inizializza l'oggetto se non esiste già
            if (!monthlyWorkedObject[monthYearKey]) {
              monthlyWorkedObject[monthYearKey] = {};
            }

            // Incrementa il conteggio per il giorno della settimana in quel mese
            if (!monthlyWorkedObject[monthYearKey][dayOfWeekKey]) {
              monthlyWorkedObject[monthYearKey][dayOfWeekKey] = 1;
            } else {
              monthlyWorkedObject[monthYearKey][dayOfWeekKey]++;
            }
          }
        }
      }
    }

    // Ora hai un oggetto che tiene traccia del numero di giorni lavorati per ogni mese e giorno della settimana
    return { timesWorked, monthlyWorkedObject };
  }

  // Funzione per calcolare il numero di giorni lavorati per ogni mese
  private calculateMonthlyWorked(): void {
    // Inizializza un oggetto per tenere traccia dei giorni lavorati per ogni mese
    const monthlyWorkedObject = {};

    // Itera attraverso i giorni lavorati
    for (const timeWorked of this.timesWorked) {
      const startDate = new Date(timeWorked.date); // Usa "date" anziché "startDate" per accedere alla data
      const monthYearKey = `${startDate.getMonth()}-${startDate.getFullYear()}`;

      // Verifica se il mese è già presente nell'oggetto
      if (monthlyWorkedObject[monthYearKey]) {
        // Se sì, aumenta il conteggio
        monthlyWorkedObject[monthYearKey]++;
      } else {
        // Altrimenti, inizializza il conteggio a 1
        monthlyWorkedObject[monthYearKey] = 1;
      }
    }

    // Converti l'oggetto in un array di oggetti con mese e giorni lavorati
    this.monthlyWorked = Object.keys(monthlyWorkedObject).map((key) => ({
      monthYear: key,
      daysWorked: monthlyWorkedObject[key],
    }));

    // Ora hai un array contenente il numero di giorni lavorati per ogni mese
  }

  private initializeChart() {
    // Preparazione dei dati per il grafico
    const sortedMonthlyWorked = this.monthlyWorked.slice(-3).sort((a, b) => {
      const [monthA, yearA] = a.monthYear.split('-');
      const [monthB, yearB] = b.monthYear.split('-');

      // Confronta gli anni e poi i mesi per l'ordinamento crescente
      if (yearA !== yearB) {
        return yearA - yearB;
      } else {
        return monthA - monthB;
      }
    });

    const labels = sortedMonthlyWorked.map((item) => {
      const [month, year] = item.monthYear.split('-');
      const monthName = new Date(year, month)
        .toLocaleString('it', { month: 'long' })
        .replace(/^\w/, (c) => c.toUpperCase())
        .slice(0, 3);
      return `${monthName} ${year}`;
    });

    const data = sortedMonthlyWorked.map((item) => item.daysWorked);

    // Creazione del grafico
    const ctx = this.myChart.nativeElement.getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Giorni Lavorati',
            data: data,
            backgroundColor: 'rgba(0, 123, 255, 0.5)',
            borderColor: 'rgba(0, 123, 255, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Calcolo giorni lavorati per mese', // Aggiungi il tuo titolo qui
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              // Assicura che il valore sia trattato come un numero
              callback: function (value) {
                if (+value % 1 === 0) {
                  return value;
                }
                return ''; // Restituisci una stringa vuota per i valori non interi
              },
            },
          },
        },
      },
    });
  }

  private initializePieCharts() {
    const ctx2 = this.myPieChart2.nativeElement.getContext('2d');
    const ctx3 = this.myPieChart3.nativeElement.getContext('2d');

    // Array di colori per i segmenti del grafico
    const colors = [
      'rgba(255, 99, 132, 0.6)',
      'rgba(54, 162, 235, 0.6)',
      'rgba(255, 206, 86, 0.6)',
      'rgba(75, 192, 192, 0.6)',
      'rgba(153, 102, 255, 0.6)',
      'rgba(255, 159, 64, 0.6)',
      'rgba(199, 199, 199, 0.6)',
    ];

    const sortedMonths = Object.keys(this.monthlyWorkedObject)
      .map((key) => {
        const [month, year] = key.split('-').map(Number);
        return new Date(year, month);
      })
      .sort((a, b) => a.getTime() - b.getTime()) // Ordina in modo crescente
      .map((date) => `${date.getMonth()}-${date.getFullYear()}`);

    console.log('sorted months:', sortedMonths);
    const lastTwoMonths = sortedMonths.slice(-2);

    lastTwoMonths.forEach((monthYear, index) => {
      const [month, year] = monthYear.split('-').map(Number);
      const monthName = new Date(year, month)
        .toLocaleString('it', { month: 'long', year: 'numeric' })
        .replace(/^\w/, (c) => c.toUpperCase());

      const data = this.monthlyWorkedObject[monthYear];
      const labels = Object.keys(data).map((day) => {
        // Mappa l'indice del giorno al nome del giorno
        const dayOfWeekNames = [
          'Domenica',
          'Lunedì',
          'Martedì',
          'Mercoledì',
          'Giovedì',
          'Venerdì',
          'Sabato',
        ];
        return dayOfWeekNames[parseInt(day.replace('day', ''))];
      });
      const values = Object.values(data);

      new Chart(index === 0 ? ctx2 : ctx3, {
        type: 'pie',
        data: {
          labels: labels,
          datasets: [
            {
              data: values,
              backgroundColor: colors.slice(0, labels.length),
              borderColor: colors.map((color) => color.replace('0.6', '1')),
              borderWidth: 1,
            },
          ],
        },
        options: {
          plugins: {
            title: {
              display: true,
              text: `Calcolo giorni settimanali lavorati - ${monthName}`,
            },
          },
        },
      });
    });
  }

  getPerson() {
    return this.urs;
  }


}
