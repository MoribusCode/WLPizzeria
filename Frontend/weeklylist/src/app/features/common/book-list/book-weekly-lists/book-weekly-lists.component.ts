import { Component, OnInit } from '@angular/core';
import { UserRequestService } from 'src/app/common/api/http-requests/requests/user/user-request.service';
import { WeeklylistRequestService } from 'src/app/common/api/http-requests/requests/weeklylist/weeklylist-request.service';
import { UserPropertyService } from 'src/app/common/api/user-property/user-property.service';
import { IWeeklyList } from 'src/app/common/interfaces/weeklylist';

@Component({
  selector: 'app-book-weekly-lists',
  templateUrl: './book-weekly-lists.component.html',
  styleUrls: ['./book-weekly-lists.component.css'],
})
export class BookWeeklyListsComponent implements OnInit {
  weeklyListData!: IWeeklyList[]; // Utilizza l'interfaccia per tipizzare i dati
  isLoading: boolean = true;
  constructor(
    private rus: UserRequestService,
    private rws: WeeklylistRequestService,
    private ups: UserPropertyService
  ) {}
  ngOnInit(): void {
    this.rws.getWeeklylistsDrafted().subscribe((data: IWeeklyList[]) => {
      this.weeklyListData = data.sort(
        (a, b) =>
          new Date(b.StartDate).getTime() - new Date(a.StartDate).getTime()
      );
      console.log(this.weeklyListData);
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
