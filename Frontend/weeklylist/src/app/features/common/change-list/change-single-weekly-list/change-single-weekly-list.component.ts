import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WeeklylistRequestService } from 'src/app/common/api/http-requests/requests/weeklylist/weeklylist-request.service';
import { UserPropertyService } from 'src/app/common/api/user-property/user-property.service';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';


import {
  DailyList,
  IUser,
  IWeeklyList,
} from 'src/app/common/interfaces/weeklylist';

interface data {
  val: string;
  date: Date;
}

@Component({
  selector: 'app-change-single-weekly-list',
  templateUrl: './change-single-weekly-list.component.html',
  styleUrls: ['./change-single-weekly-list.component.css'],
})
export class ChangeSingleWeeklyListComponent {
  weeklyList!: IWeeklyList; // Tipo dati da sostituire con la tua interfaccia
  endData : Date

  items: { user: IUser; data: data[] }[] = [];

  none: string = 'NONE';
  ownCar: string = 'OWNCAR';
  pizzaCar: string = 'PIZZACAR';

  constructor(
    private route: ActivatedRoute,
    private wrs: WeeklylistRequestService,
    private router: Router,
    private ups: UserPropertyService,
  ) {}

  ngOnInit(): void {
    // Estrai la stringa JSON dal parametro 'id' e decodificala in un oggetto

    const encodedWeeklyList = this.route.snapshot.params['id'];
    this.weeklyList = JSON.parse(decodeURIComponent(encodedWeeklyList));

    this.endData = new Date(this.weeklyList.StartDate);

  // Aggiungi 6 giorni alla StartDate per ottenere la endDate
    this.endData.setDate(this.endData.getDate() + 6);
    console.log(this.endData)

    for (let worker of this.weeklyList.workers) {
      const day: data[] = [];
      for (let dayName of this.weeklyList.weeklyList) {
        day.push({ val: '', date: dayName.day });
      }
      this.items.push({ user: worker, data: day });
    }


    for (let dayList of this.weeklyList.weeklyList) {
      for (let worker of dayList.workerList) {
        const index = this.items.findIndex(
          (data) => data.user._id === worker.user._id
        );
        const data = this.items[index];

        const indexData = data.data.findIndex(
          (data) => data.date === dayList.day
        );

        if (worker.useHisCar) {
          data.data[indexData].val = 'OWNCAR';
        } else {
          data.data[indexData].val = 'PIZZACAR';
        }
      }
    }
  }

  onFormSubmit(updatedItems: any): void {

    this.items.forEach((data, index) => {
      data.data.forEach((data1, index1) => {
        const workerListForDay = this.weeklyList.weeklyList[index1].workerList;

        // Check if user exists in workerListForDay
        const userIndex = workerListForDay.findIndex(
          (worker) => worker.user._id === data.user._id
        );

        switch (data1.val) {
          case 'PIZZACAR':
            if (userIndex === -1) {
              // user doesn't exist in workerList
              workerListForDay.push({ user: data.user, useHisCar: false });
            } else {
              if (workerListForDay[userIndex].useHisCar) {
                // If the user is using his own car, change to false
                workerListForDay[userIndex].useHisCar = false;
              }
            }
            break;

          case 'OWNCAR':
            if (userIndex === -1) {
              // user doesn't exist in workerList
              workerListForDay.push({ user: data.user, useHisCar: true });
            } else {
              if (!workerListForDay[userIndex].useHisCar) {
                // If the user is not using his own car, change to true
                workerListForDay[userIndex].useHisCar = true;
              }
            }
            break;

          case 'NONE':
            if (userIndex !== -1) {
              // user exists in workerList
              workerListForDay.splice(userIndex, 1); // remove user from workerList
            }
            break;
        }
      });
    });
    this.wrs.putWeeklyListModifications(this.weeklyList).subscribe(
      (data) => {
        const weeklyListJSON = JSON.stringify(this.weeklyList);
        const encodedWeeklyList = encodeURIComponent(weeklyListJSON);

        if (this.ups.getIsOwner()) {
          this.router.navigate(['/admin-dashboard/weekly-lists-not-drafted'], {
              state: { modifiedListId: this.weeklyList._id }
          });
      } else {
          this.router.navigate(['/user-dashboard/weekly-lists-not-drafted'], {
              state: { modifiedListId: this.weeklyList._id }
          });
      }
      },
      (error) => {
        console.log(error);
      }
    );

  }

  stampaLista() {
    this.weeklyList.weeklyList.forEach((data) => {
      let output = `${data.day}:\n`; // Start with the day

      data.workerList.forEach((data1) => {
        output += `User: ${data1.user.firstName} --- Use his car: ${
          data1.useHisCar ? 'Yes' : 'No'
        }\n`;
      });

    });
  }


  translateDayName(date: Date): string {
    const dayName = format(new Date(date), 'EEEE', { locale: it });
    return dayName.charAt(0).toUpperCase() + dayName.slice(1);
  }
}
