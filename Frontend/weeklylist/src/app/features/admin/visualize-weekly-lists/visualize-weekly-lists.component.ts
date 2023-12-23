import { Component, OnInit } from '@angular/core';
import { UserRequestService } from 'src/app/common/api/http-requests/requests/user/user-request.service';
import { WeeklylistRequestService } from 'src/app/common/api/http-requests/requests/weeklylist/weeklylist-request.service';
import { IWeeklyList } from 'src/app/common/interfaces/weeklylist';

@Component({
  selector: 'app-visualize-weekly-lists',
  templateUrl: './visualize-weekly-lists.component.html',
  styleUrls: ['./visualize-weekly-lists.component.css'],
})
export class VisualizeWeeklyListsComponent implements OnInit {
  weeklyListData!: IWeeklyList[]; // Utilizza l'interfaccia per tipizzare i dati
  isLoading: boolean = true;

  constructor(
    private rus: UserRequestService,
    private rws: WeeklylistRequestService
  ) {}
  ngOnInit(): void {
    this.rws
      .getWeeklylistsDraftedToCompute()
      .subscribe((data: IWeeklyList[]) => {
        this.weeklyListData = data.sort(
          (a, b) =>
            new Date(b.StartDate).getTime() - new Date(a.StartDate).getTime()
        );
        this.isLoading = false;
      });
  }
  onListDeleted(weeklyList: IWeeklyList) {
    // Rimuovi la lista eliminata dalla vista
    const index = this.weeklyListData.findIndex(
      (list) => list._id === weeklyList._id
    );
    if (index !== -1) {
      this.weeklyListData.splice(index, 1);
    }
  }
}
