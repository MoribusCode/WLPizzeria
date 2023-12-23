import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookWeeklyListsComponent } from './book-weekly-lists.component';

describe('BookWeeklyListsComponent', () => {
  let component: BookWeeklyListsComponent;
  let fixture: ComponentFixture<BookWeeklyListsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookWeeklyListsComponent]
    });
    fixture = TestBed.createComponent(BookWeeklyListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
