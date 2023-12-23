import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UserRequestService } from 'src/app/common/api/http-requests/requests/user/user-request.service';
import { WeeklylistRequestService } from 'src/app/common/api/http-requests/requests/weeklylist/weeklylist-request.service';
import { UserPropertyService } from 'src/app/common/api/user-property/user-property.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-renvenues-chart',
  templateUrl: './renvenues-chart.component.html',
  styleUrls: ['./renvenues-chart.component.css']
})
export class RenvenuesChartComponent implements OnInit{


  groupedByMonthAndYear = {};
  @ViewChild('comparisonCarUsed') comparisonCarUsed: ElementRef;
  @ViewChild('renvenuesForMonth') renvenuesForMonth: ElementRef;

  constructor(private urs: UserRequestService, private  ups: UserPropertyService, private rws: WeeklylistRequestService) {}

  ngOnInit(): void {
    this.rws.getWeeklylistsNotDrafted().subscribe(
      (result) => {
        let allListWithWeeklylistArray: any[] = []; // Dichiaralo come array vuoto

        for (let weeklyList of result) {
          const startDate = weeklyList.StartDate;
          const weeklyListData = weeklyList.weeklyList;

          for(let weekly of weeklyListData){
            for(let worker of weekly.workerList){
              if(worker.user._id === this.ups.getId()){
                const dateWithTime = new Date(weekly.day); // Crea una nuova data
                dateWithTime.setHours(0, 0, 0, 0);
                allListWithWeeklylistArray.push({
                  day : dateWithTime,
                  useHisCar : worker.useHisCar
                })
              }
            }
          }
        }

        for (const item of allListWithWeeklylistArray) {

          const key = `${item.day.getMonth() + 1}-${item.day.getFullYear()}`;


          if (!this.groupedByMonthAndYear[key]) {
            this.groupedByMonthAndYear[key] = {
              userHisCar: 0,
              notUseHisCar: 0
            };
          }
          if(item.useHisCar){
            this.groupedByMonthAndYear[key].userHisCar ++
          }else{
            this.groupedByMonthAndYear[key].notUseHisCar ++
          }
        }

        const keys = Object.keys(this.groupedByMonthAndYear);

        keys.sort((a, b) => {
          const dateA = new Date(a);
          const dateB = new Date(b);
          return dateA.getTime() - dateB.getTime();
        });

        const sortedGroupedByMonthAndYear = {};

        for (const key of keys) {
          sortedGroupedByMonthAndYear[key] = this.groupedByMonthAndYear[key];
        }

        this.groupedByMonthAndYear = Object.fromEntries(Object.entries(sortedGroupedByMonthAndYear).slice(0, 5));

        this.createChart()
        this.createChartRenvenue()

      },
      (error) => {
        console.error('Errore durante l\'esecuzione dell\'Observable:', error);
      }
    );
  }

  createChart() {
    const labels = Object.keys(this.groupedByMonthAndYear);
    const userHisCarData = labels.map(key => this.groupedByMonthAndYear[key].userHisCar);
    const notUseHisCarData = labels.map(key => this.groupedByMonthAndYear[key].notUseHisCar);

    const ctx = this.comparisonCarUsed.nativeElement.getContext('2d');
    const myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Macchina Propria',
            data: userHisCarData,
            backgroundColor: 'rgba(75, 192, 192, 0.2)', // Colore di riempimento
            borderColor: 'rgba(75, 192, 192, 1)', // Colore del bordo
            borderWidth: 1 // Larghezza del bordo
          },
          {
            label: 'Macchina Pizzeria',
            data: notUseHisCarData,
            backgroundColor: 'rgba(255, 99, 132, 0.2)', // Colore di riempimento
            borderColor: 'rgba(255, 99, 132, 1)', // Colore del bordo
            borderWidth: 1 // Larghezza del bordo
          }
        ]
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: `Grafico delle macchine`
          }
        }
      }
    });
  }

  createChartRenvenue() {
    const labels = Object.keys(this.groupedByMonthAndYear);
    const userHisCarData = labels.map(key => (this.groupedByMonthAndYear[key].userHisCar * 40) + (this.groupedByMonthAndYear[key].notUseHisCar * 30));

    const ctx = this.renvenuesForMonth.nativeElement.getContext('2d');
    const myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Entrate (€)', // Aggiungi il suffisso euro all'etichetta
            data: userHisCarData,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: `Grafico delle entrate`
          }
        },
        scales: {
          y: {
            beginAtZero: true, // Inizia da zero sull'asse delle ordinate
            ticks: {
              callback: (value) => `${value} €` // Aggiungi il simbolo euro (€) al valore
            }
          }
        }
      }
    });
  }







}
