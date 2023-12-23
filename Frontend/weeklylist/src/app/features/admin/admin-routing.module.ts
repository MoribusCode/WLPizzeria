import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BaseComponent } from './base/base.component';
import { OwnerDashboardComponent } from './owner-dashboard/owner-dashboard.component';
import { CreateListComponent } from './create-list/create-list.component';
import { AddUserComponent } from './add-user/add-user.component';
import { VisualizeWeeklyListsComponent } from './visualize-weekly-lists/visualize-weekly-lists.component';
import { VisualizeSingleWeeklylistComponent } from './visualize-single-weeklylist/visualize-single-weeklylist.component';
import { BookSingleWeeklyListComponent } from '../common/book-list/book-single-weekly-list/book-single-weekly-list.component';
import { BookWeeklyListsComponent } from '../common/book-list/book-weekly-lists/book-weekly-lists.component';
import { VisualizeSingleWeeklylistNotDraftedComponent } from '../common/visualize-list/visualize-single-weeklylist-not-drafted/visualize-single-weeklylist-not-drafted.component';
import { VisualizeWeeklyListsNotDraftedComponent } from '../common/visualize-list/visualize-weekly-lists-not-drafted/visualize-weekly-lists-not-drafted.component';
import { ChangeWeeklyListComponent } from '../common/change-list/change-weekly-list/change-weekly-list.component';
import { ChangeSingleWeeklyListComponent } from '../common/change-list/change-single-weekly-list/change-single-weekly-list.component';
import { VisualizeUsersComponent } from './visualize-users/visualize-users.component';
import { VisualizeCalendarComponent } from '../common/visualize-calendar/visualize-calendar/visualize-calendar.component';
import { VisualizeRevenuesComponent } from './visualize-revenues/visualize-revenues.component';
import { VisualizeRenvenueSinglePersonComponent } from '../common/visualize-renvenue-single-person/visualize-renvenue-single-person/visualize-renvenue-single-person.component';
import { UserFeaturesComponent } from './user-features/user-features.component';
import { OptionsComponent } from '../common/options/options/options.component';

const routes: Routes = [{
  path : '',
  component: BaseComponent,
  children: [
    {
      path: '' , component : OwnerDashboardComponent
    },
    {
      path: 'user-features' , component : UserFeaturesComponent
    },

    {
      path: 'create-list' , component : CreateListComponent
    },
    {
      path: 'add-user' , component : AddUserComponent
    },
    {
      path: 'visualize-users' , component : VisualizeUsersComponent
    },
    {
      path: 'weekly-lists-drafted' , component : VisualizeWeeklyListsComponent
    },
    {
      path: 'weekly-lists-drafted/:id', // Visualizza una singola lista settimanale per ID
      component: VisualizeSingleWeeklylistComponent
    },
    {
      path: 'weekly-lists-not-drafted' , component : VisualizeWeeklyListsNotDraftedComponent
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
      path: 'visualize-revenues', // Visualizza una singola lista settimanale per ID
      component: VisualizeRevenuesComponent
    },
    {
      path: 'visualize-revenue', // Visualizza una singola lista settimanale per ID
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
export class AdminRoutingModule { }
