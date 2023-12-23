import { Component, OnInit } from '@angular/core';
import { UserRequestService } from 'src/app/common/api/http-requests/requests/user/user-request.service';
import { WeeklylistRequestService } from 'src/app/common/api/http-requests/requests/weeklylist/weeklylist-request.service';
import { UserPropertyService } from 'src/app/common/api/user-property/user-property.service';
import { IUser, IWeeklyList } from 'src/app/common/interfaces/weeklylist';

@Component({
  selector: 'app-visualize-renvenue-single-person',
  templateUrl: './visualize-renvenue-single-person.component.html',
  styleUrls: ['./visualize-renvenue-single-person.component.css']
})
export class VisualizeRenvenueSinglePersonComponent implements OnInit {
  isLoading: boolean = true;
  monthlyData: MonthlyData[] = [];
  users: IUser[] = [];

  constructor(private urs: UserRequestService, private  ups: UserPropertyService, private rws: WeeklylistRequestService) {}

  ngOnInit(): void {
    this.urs.getUsers().subscribe((data) => {
      this.users = data;
      this.rws.getWeeklylistsNotDrafted().subscribe((data: IWeeklyList[]) => {
        data.forEach((weeklyList) => {
          weeklyList.weeklyList.forEach((dailyList) => {
            const date = new Date(dailyList.day);
            const monthYearKey = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
            const workerList = dailyList.workerList;
            const userId = this.ups.getId();

            // Filtra dailyList.workerList in base all'ID dell'utente
            const userWorkerList = workerList.filter(worker => worker.user._id === userId);

            if (userWorkerList.length > 0) {
              // Trova il mese nell'array monthlyData o crea un nuovo oggetto mensile
              let monthlyEntry = this.monthlyData.find((entry) => entry.month === monthYearKey);

              if (!monthlyEntry) {
                monthlyEntry = {
                  month: monthYearKey,
                  workers: [],
                  days: [],
                };
                this.monthlyData.push(monthlyEntry);
              }

              const dayOfMonth = new Date(dailyList.day).getDate();
              // Trova il giorno nell'array days di monthlyEntry o crea un nuovo oggetto giornaliero
              let dayEntry = monthlyEntry.days.find((entry) => entry.day === dayOfMonth);

              if (!dayEntry) {
                dayEntry = {
                  day: dayOfMonth,
                  usedDays: 0,
                  unusedDays: 0,
                };
                monthlyEntry.days.push(dayEntry);
              }

              userWorkerList.forEach((worker) => {
                const user = this.getUserById(userId);

                if (user) {
                  const userName = user._id;
                  // Trova l'entry del lavoratore nell'array workers di monthlyEntry
                  let existingWorkerEntry = monthlyEntry.workers.find((entry) => entry.user === userName);

                  if (!existingWorkerEntry) {
                    existingWorkerEntry = {
                      user: userName,
                      usedDays: 0,
                      unusedDays: 0,
                      earnings: 0, // Calcola e imposta i guadagni
                    };
                    monthlyEntry.workers.push(existingWorkerEntry);
                  }

                  existingWorkerEntry.earnings = this.calculateEarnings(worker);
                  if (worker.useHisCar) {
                    existingWorkerEntry.usedDays++;
                    dayEntry.usedDays++;
                  } else {
                    existingWorkerEntry.unusedDays++;
                    dayEntry.unusedDays++;
                  }
                }
              });
            }
          });
        });
        this.isLoading = false;
        this.monthlyData.sort((a, b) => {
          const [monthA, yearA] = a.month.split(' ');
          const [monthB, yearB] = b.month.split(' ');

          // Confronta gli anni (inversamente)
          const yearComparison = parseInt(yearB) - parseInt(yearA);

          if (yearComparison !== 0) {
            return yearComparison;
          }

          // Confronta i mesi (inversamente)
          const months = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'];
          const monthIndexA = months.indexOf(monthA.toLowerCase());
          const monthIndexB = months.indexOf(monthB.toLowerCase());

          return monthIndexB - monthIndexA;
        });
        console.log(this.monthlyData)
      });
    });
  }




  getUserById(userId: string): IUser {
    return this.users.find((user) => user._id === userId);
  }


  calculateEarnings(worker): number {
    return this.calculateEarningsWithHisCar(worker) + this.calculateEarningsWithPizzeriaCar(worker)
  }

  calculateEarningsWithHisCar(worker): number {
    const rate = 40; // Tasso per i giorni utilizzati
    const usedEarnings = rate * worker.usedDays;
    return usedEarnings;
  }

  calculateEarningsWithPizzeriaCar(worker): number {
    const unusedRate = 30; // Tasso per i giorni non utilizzati
    const unusedEarnings = unusedRate * worker.unusedDays;
    return unusedEarnings;
  }
}
interface MonthlyData {
  month: string;
  workers: WorkerEntry[];
  days: DayEntry[];
}

interface DayEntry {
  day: number;
  usedDays: number;
  unusedDays: number;
}

interface WorkerEntry {
  user: string;
  usedDays: number;
  unusedDays: number;
  earnings: number; // Nuova proprietà per il guadagno
}
