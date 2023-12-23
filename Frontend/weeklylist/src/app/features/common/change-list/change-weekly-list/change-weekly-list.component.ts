import { Component, OnInit } from '@angular/core';
import { UserRequestService } from 'src/app/common/api/http-requests/requests/user/user-request.service';
import { WeeklylistRequestService } from 'src/app/common/api/http-requests/requests/weeklylist/weeklylist-request.service';
import { IWeeklyList } from 'src/app/common/interfaces/weeklylist';

@Component({
  selector: 'app-change-weekly-list',
  templateUrl: './change-weekly-list.component.html',
  styleUrls: ['./change-weekly-list.component.css']
})
export class ChangeWeeklyListComponent implements OnInit{
  weeklyListData!: IWeeklyList[]; // Utilizza l'interfaccia per tipizzare i dati

  constructor(private rus : UserRequestService, private rws : WeeklylistRequestService){

  }
  ngOnInit(): void {
    this.rws.getWeeklylistsNotDrafted().subscribe((data: IWeeklyList[]) => {
      this.weeklyListData = data.sort((a, b) =>
        new Date(b.StartDate).getTime() - new Date(a.StartDate).getTime()
      );
      console.log(this.weeklyListData)
    });
  }

  onListDeleted1(weeklyList: IWeeklyList) {
    // Rimuovi la lista eliminata dalla vista
    const index = this.weeklyListData.findIndex(
      (list) => list._id === weeklyList._id
    );
    if (index !== -1) {
      this.weeklyListData.splice(index, 1);
    }
  }



}
