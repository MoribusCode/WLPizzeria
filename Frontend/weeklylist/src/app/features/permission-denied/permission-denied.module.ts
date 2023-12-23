import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PermissionDeniedRoutingModule } from './permission-denied-routing.module';
import { VisualizePermissionDeniedComponent } from './visualize-permission-denied/visualize-permission-denied.component';


@NgModule({
  declarations: [
    VisualizePermissionDeniedComponent
  ],
  imports: [
    CommonModule,
    PermissionDeniedRoutingModule
  ]
})
export class PermissionDeniedModule {


}
