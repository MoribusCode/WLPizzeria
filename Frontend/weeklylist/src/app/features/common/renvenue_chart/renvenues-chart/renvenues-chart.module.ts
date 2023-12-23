import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RenvenuesChartComponent } from './renvenues-chart/renvenues-chart.component';



@NgModule({
  declarations: [
    RenvenuesChartComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    RenvenuesChartComponent
  ]
})
export class RenvenuesChartModule { }
