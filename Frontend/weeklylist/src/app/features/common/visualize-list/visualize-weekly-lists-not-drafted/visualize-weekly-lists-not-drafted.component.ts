import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserRequestService } from 'src/app/common/api/http-requests/requests/user/user-request.service';
import { WeeklylistRequestService } from 'src/app/common/api/http-requests/requests/weeklylist/weeklylist-request.service';
import { IWeeklyList } from 'src/app/common/interfaces/weeklylist';

@Component({
  selector: 'app-visualize-weekly-lists-not-drafted',
  templateUrl: './visualize-weekly-lists-not-drafted.component.html',
  styleUrls: ['./visualize-weekly-lists-not-drafted.component.css']
})
export class VisualizeWeeklyListsNotDraftedComponent implements OnInit{
  weeklyListData!: IWeeklyList[];
  isLoading: boolean = true;
  modifiedListId?: string;
  constructor(private rus : UserRequestService, private rws : WeeklylistRequestService, private router: Router){
    const navigation = this.router.getCurrentNavigation();

    if (navigation && navigation.extras && navigation.extras.state) {
        const state = navigation.extras.state as { modifiedListId: string };

        if (state) {
            this.modifiedListId = state.modifiedListId;
        }
    }
  }
  ngOnInit(): void {
    this.rws.getWeeklylistsNotDrafted()
      .subscribe((data: IWeeklyList[]) => {
        this.weeklyListData = data.sort((a, b) => new Date(b.StartDate).getTime() - new Date(a.StartDate).getTime());
        this.isLoading = false;
      });

  }

  onListDeleted(weeklyList: IWeeklyList) {
    const index = this.weeklyListData.findIndex(list => list._id === weeklyList._id);
    if (index !== -1) {
      this.weeklyListData.splice(index, 1);
    }
  }


}
