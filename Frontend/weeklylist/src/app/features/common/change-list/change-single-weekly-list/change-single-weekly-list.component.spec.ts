import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeSingleWeeklyListComponent } from './change-single-weekly-list.component';

describe('ChangeSingleWeeklyListComponent', () => {
  let component: ChangeSingleWeeklyListComponent;
  let fixture: ComponentFixture<ChangeSingleWeeklyListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChangeSingleWeeklyListComponent]
    });
    fixture = TestBed.createComponent(ChangeSingleWeeklyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
