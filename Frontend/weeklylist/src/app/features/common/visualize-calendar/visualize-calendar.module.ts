import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { VisualizeCalendarComponent } from './visualize-calendar/visualize-calendar.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    VisualizeCalendarComponent,

  ],
  imports: [
    CommonModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    FormsModule
  ],
})
export class VisualizeCalendarModule { }
