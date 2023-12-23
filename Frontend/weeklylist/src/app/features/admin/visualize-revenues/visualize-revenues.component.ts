import { Component, OnInit } from '@angular/core';
import { UserRequestService } from 'src/app/common/api/http-requests/requests/user/user-request.service';
import { WeeklylistRequestService } from 'src/app/common/api/http-requests/requests/weeklylist/weeklylist-request.service';
import { Worker } from 'src/app/common/interfaces/weeklylist';

import {
  DailyList,
  IUser,
  IWeeklyList,
} from 'src/app/common/interfaces/weeklylist';

@Component({
  selector: 'app-visualize-revenues',
  templateUrl: './visualize-revenues.component.html',
  styleUrls: ['./visualize-revenues.component.css'],
})
export class VisualizeRevenuesComponent implements OnInit {
  isLoading: boolean = true;
  monthlyData: MonthlyData[] = [];
  users: IUser[] = [];

  constructor(private urs: UserRequestService, private rws: WeeklylistRequestService) {}

  ngOnInit(): void {
    this.urs.getUsers().subscribe((data) => {
      this.users = data;
      this.rws.getWeeklylistsNotDrafted().subscribe((data: IWeeklyList[]) => {
        data.forEach((weeklyList) => {
          weeklyList.weeklyList.forEach((dailyList) => {
            const monthKey = new Date(dailyList.day).toLocaleString('default', { month: 'long' });
            const workerList = dailyList.workerList;

            // Cerca il mese nell'array monthlyData o crea un nuovo oggetto mensile
            let monthlyEntry = this.monthlyData.find((entry) => entry.month === monthKey);

            if (!monthlyEntry) {
              monthlyEntry = {
                month: monthKey,
                workers: [],
                days: [],
              };
              this.monthlyData.push(monthlyEntry);
            }

            const dayOfMonth = new Date(dailyList.day).getDate();
            // Cerca il giorno nell'array days di monthlyEntry o crea un nuovo oggetto giornaliero
            let dayEntry = monthlyEntry.days.find((entry) => entry.day === dayOfMonth);

            if (!dayEntry) {
              dayEntry = {
                day: dayOfMonth,
                usedDays: 0,
                unusedDays: 0,
              };
              monthlyEntry.days.push(dayEntry);
            }

            workerList.forEach((worker) => {
              const userId = worker.user._id;
              const user = this.getUserById(userId);

              if (user) {
                const userName = user._id;
                // Cerca l'entry del lavoratore nell'array workers di monthlyEntry
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
          });
        });


        this.isLoading = false;

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

