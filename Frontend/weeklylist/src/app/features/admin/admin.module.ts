import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { OwnerDashboardComponent } from './owner-dashboard/owner-dashboard.component';
import { BaseComponent } from './base/base.component';
import { NavbarComponent } from './navbar/navbar.component';
import { CreateListComponent } from './create-list/create-list.component';
import { FormsModule } from '@angular/forms';
import { AddUserComponent } from './add-user/add-user.component';
import { VisualizeWeeklyListsComponent } from './visualize-weekly-lists/visualize-weekly-lists.component';
import { VisualizeSingleWeeklylistComponent } from './visualize-single-weeklylist/visualize-single-weeklylist.component';
import { BookListModule } from '../common/book-list/book-list.module';
import { VisualizeListModule } from '../common/visualize-list/visualize-list.module';
import { ListButtonModule } from '../common/list-button/list-button.module';
import { FeatureButtonComponent } from './owner-dashboard/feature-button/feature-button.component';
import { ChangeListModule } from '../common/change-list/change-list.module';
import { VisualizeUsersComponent } from './visualize-users/visualize-users.component';
import { VisualizeCalendarModule } from '../common/visualize-calendar/visualize-calendar.module';
import { VisualizeRevenuesComponent } from './visualize-revenues/visualize-revenues.component';
import { UserFeaturesComponent } from './user-features/user-features.component';
import { RenvenuesChartModule } from '../common/renvenue_chart/renvenues-chart/renvenues-chart.module';
import { PopupNotificationModule } from '../common/popup-notification/popup-notification.module';
import { OptionsModule } from '../common/options/options.module';


@NgModule({
  declarations: [
    OwnerDashboardComponent,
    BaseComponent,
    NavbarComponent,
    CreateListComponent,
    AddUserComponent,
    VisualizeWeeklyListsComponent,
    VisualizeSingleWeeklylistComponent,
    FeatureButtonComponent,
    VisualizeUsersComponent,
    VisualizeRevenuesComponent,
    UserFeaturesComponent,
  ],
  imports: [
    BookListModule,
    VisualizeListModule,
    ListButtonModule,
    FormsModule,
    CommonModule,
    AdminRoutingModule,
    VisualizeCalendarModule,
    RenvenuesChartModule,
    PopupNotificationModule,
    OptionsModule
  ]
})
export class AdminModule { }
