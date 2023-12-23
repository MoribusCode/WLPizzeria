import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookSingleWeeklyListComponent } from './book-single-weekly-list/book-single-weekly-list.component';
import { BookWeeklyListsComponent } from './book-weekly-lists/book-weekly-lists.component';
import { ListButtonComponent } from '../list-button/list-button.component';
import { ListButtonModule } from '../list-button/list-button.module';

@NgModule({
  declarations: [BookSingleWeeklyListComponent, BookWeeklyListsComponent],
  exports : [BookSingleWeeklyListComponent, BookWeeklyListsComponent],
  imports: [
    CommonModule, ListButtonModule
  ]
})
export class BookListModule { }

