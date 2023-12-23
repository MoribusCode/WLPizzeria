import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisualizeSingleWeeklylistNotDraftedComponent } from './visualize-single-weeklylist-not-drafted/visualize-single-weeklylist-not-drafted.component';
import { VisualizeWeeklyListsNotDraftedComponent } from './visualize-weekly-lists-not-drafted/visualize-weekly-lists-not-drafted.component';
import { ListButtonModule } from '../list-button/list-button.module';



@NgModule({
  declarations: [VisualizeSingleWeeklylistNotDraftedComponent, VisualizeWeeklyListsNotDraftedComponent],
  exports : [VisualizeSingleWeeklylistNotDraftedComponent, VisualizeWeeklyListsNotDraftedComponent],
  imports: [
    CommonModule, ListButtonModule
  ]
})
export class VisualizeListModule { }
