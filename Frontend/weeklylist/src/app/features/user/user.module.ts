import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { BaseComponent } from './base/base.component';
import { FeatureButtonComponent } from './dashboard/feature-button/feature-button.component';
import { ChangeListModule } from '../common/change-list/change-list.module';
import { VisualizeCalendarModule } from '../common/visualize-calendar/visualize-calendar.module';
import { RenvenuesChartModule } from '../common/renvenue_chart/renvenues-chart/renvenues-chart.module';
import { OptionsModule } from '../common/options/options.module';


@NgModule({
  declarations: [
    DashboardComponent,
    NavbarComponent,
    BaseComponent,
    FeatureButtonComponent
  ],
  imports: [
    ChangeListModule,
    FormsModule,
    CommonModule,
    UserRoutingModule,
    VisualizeCalendarModule,
    RenvenuesChartModule,
    OptionsModule
  ]
})
export class UserModule { }
