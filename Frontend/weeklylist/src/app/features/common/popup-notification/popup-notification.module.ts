import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupNotificationComponent } from './popup-notification/popup-notification.component';



@NgModule({
  declarations: [
    PopupNotificationComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    PopupNotificationComponent
  ],

})
export class PopupNotificationModule { }
