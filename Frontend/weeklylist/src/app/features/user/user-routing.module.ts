import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BaseComponent } from './base/base.component';
import { VisualizeWeeklyListsNotDraftedComponent } from '../common/visualize-list/visualize-weekly-lists-not-drafted/visualize-weekly-lists-not-drafted.component';
import { VisualizeSingleWeeklylistNotDraftedComponent } from '../common/visualize-list/visualize-single-weeklylist-not-drafted/visualize-single-weeklylist-not-drafted.component';
import { BookWeeklyListsComponent } from '../common/book-list/book-weekly-lists/book-weekly-lists.component';
import { BookSingleWeeklyListComponent } from '../common/book-list/book-single-weekly-list/book-single-weekly-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ChangeWeeklyListComponent } from '../common/change-list/change-weekly-list/change-weekly-list.component';
import { ChangeSingleWeeklyListComponent } from '../common/change-list/change-single-weekly-list/change-single-weekly-list.component';
import { VisualizeCalendarComponent } from '../common/visualize-calendar/visualize-calendar/visualize-calendar.component';
import { VisualizeRenvenueSinglePersonModule } from '../common/visualize-renvenue-single-person/visualize-renvenue-single-person.module';
import { VisualizeRenvenueSinglePersonComponent } from '../common/visualize-renvenue-single-person/visualize-renvenue-single-person/visualize-renvenue-single-person.component';
import { OptionsComponent } from '../common/options/options/options.component';

const routes: Routes = [{
  path : '',
  component: BaseComponent,
  children: [
    {
      path: '' , component : DashboardComponent
    },
    {
      path: 'weekly-lists-not-drafted' ,
      component : VisualizeWeeklyListsNotDraftedComponent
    },
    {
      path: 'user-features' ,
      component : DashboardComponent
    },
    {
      path: 'weekly-lists-not-drafted/:id', // Visualizza una singola lista settimanale per ID
      component: VisualizeSingleWeeklylistNotDraftedComponent
    },
    {
      path: 'book_weekly-list', // Visualizza una singola lista settimanale per ID
      component: BookWeeklyListsComponent
    },
    {
      path: 'book_weekly-list/:id', // Visualizza una singola lista settimanale per ID
      component: BookSingleWeeklyListComponent
    },
    {
      path: 'change_weekly-list', // Visualizza una singola lista settimanale per ID
      component: ChangeWeeklyListComponent
    },
    {
      path: 'change_weekly-list/:id', // Visualizza una singola lista settimanale per ID
      component: ChangeSingleWeeklyListComponent
    },
    {
      path: 'visualize-calendar', // Visualizza una singola lista settimanale per ID
      component: VisualizeCalendarComponent
    },
    {
      path: 'visualize-renvenue', // Visualizza una singola lista settimanale per ID
      component: VisualizeRenvenueSinglePersonComponent
    },
    {
      path: 'options', // Visualizza una singola lista settimanale per ID
      component: OptionsComponent
    },

    ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
