import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListButtonComponent } from './list-button.component';



@NgModule({
  declarations: [ListButtonComponent],
  exports: [ListButtonComponent],
  imports: [
    CommonModule
  ]
})
export class ListButtonModule { }
