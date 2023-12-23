import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookSingleWeeklyListComponent } from './book-single-weekly-list.component';

describe('BookSingleWeeklyListComponent', () => {
  let component: BookSingleWeeklyListComponent;
  let fixture: ComponentFixture<BookSingleWeeklyListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookSingleWeeklyListComponent]
    });
    fixture = TestBed.createComponent(BookSingleWeeklyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
