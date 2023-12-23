import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeWeeklyListComponent } from './change-weekly-list.component';

describe('ChangeWeeklyListComponent', () => {
  let component: ChangeWeeklyListComponent;
  let fixture: ComponentFixture<ChangeWeeklyListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChangeWeeklyListComponent]
    });
    fixture = TestBed.createComponent(ChangeWeeklyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
