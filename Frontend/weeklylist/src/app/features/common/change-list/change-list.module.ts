import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeWeeklyListComponent } from './change-weekly-list/change-weekly-list.component';
import { ChangeSingleWeeklyListComponent } from './change-single-weekly-list/change-single-weekly-list.component';
import { ListButtonModule } from '../list-button/list-button.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ChangeWeeklyListComponent,
    ChangeSingleWeeklyListComponent
  ],
  exports : [ChangeSingleWeeklyListComponent, ChangeWeeklyListComponent],
  imports: [
    CommonModule, ListButtonModule, FormsModule, ReactiveFormsModule,
  ],

})
export class ChangeListModule { }
